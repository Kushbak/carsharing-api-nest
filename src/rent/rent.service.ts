import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Car } from 'src/car/entities/car.entity'
import { WEEKDAYS } from 'src/utils/const'
import { Raw, Repository } from 'typeorm'
import { CreateRentDto } from './dto/create-rent.dto'
import { Rent } from './entities/rent.entity'
import dayjs from '../utils/dayjs'

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  tariffs = [
    {
      id: 1,
      price: 270,
      distance: 200,
    },
    {
      id: 2,
      price: 330,
      distance: 350,
    },
    {
      id: 3,
      price: 390,
      distance: 500,
    },
  ]

  private checkForWeekdayRent(rent: CreateRentDto) {
    const start_date_weekday = dayjs(rent.start_date).weekday()
    if (WEEKDAYS.includes(start_date_weekday)) {
      throw new BadRequestException(`You may not start a rent on a weekend`)
    }
    const end_date_weekday = dayjs(rent.end_date).weekday()
    console.log({ start_date_weekday, end_date_weekday })
    if (WEEKDAYS.includes(end_date_weekday)) {
      throw new BadRequestException(`You may not end a rent on a weekend`)
    }
  }

  private async checkForPauseBetweenRent(rent: CreateRentDto) {
    const carToRent = await this.carRepository.findOne({
      where: {
        id: rent.car_id,
      },
      relations: {
        rents: true,
      },
    })

    if (carToRent.rents.length) {
      const daysBetweenLastRent = dayjs(rent.start_date).diff(
        carToRent.rents[carToRent.rents.length - 1].end_date,
        'day',
      )

      if (daysBetweenLastRent < 3) {
        throw new BadRequestException(
          'The pause between bookings should be 3 days',
        )
      }
    }
  }

  private checkForMaxRentDay(rent: CreateRentDto) {
    const daysOfRent = dayjs(rent.end_date).diff(rent.start_date, 'day')
    if (daysOfRent > 30) {
      throw new BadRequestException(
        'You cannot rent a car for more than one month',
      )
    }
  }

  private sumWithDiscount(sum: number, days: number): number {
    if (days > 15 && days < 30) {
      return sum - sum * 0.05 // 5%
    }
    if (days > 6 && days < 14) {
      return sum - sum * 0.1 // 10%
    }
    return sum - sum * 0.15 // 15%
  }

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    const car = await this.carRepository.findOne({
      where: { id: createRentDto.car_id },
    })
    if (!car) {
      throw new NotFoundException(
        `Car with id ${createRentDto.car_id} not exists`,
      )
    }
    if (!car.is_available) {
      throw new BadRequestException('Car is not available')
    }

    const rent = { ...createRentDto, car }
    console.log({ rent, createRentDto, car })

    rent.start_date = new Date(createRentDto.start_date)
    rent.end_date = new Date(createRentDto.end_date)
    this.checkForMaxRentDay(rent)
    this.checkForWeekdayRent(rent)
    await this.checkForPauseBetweenRent(rent)

    const rentDaysAmount = dayjs(rent.end_date).diff(rent.start_date, 'day')

    const tariff = this.tariffs.find((item) => item.id === rent.tariff)
    rent.total_sum = rentDaysAmount * tariff.price

    if (rentDaysAmount > 2) {
      rent.total_sum = this.sumWithDiscount(rent.total_sum, rentDaysAmount)
    }

    const newRent = await this.rentRepository.save(rent)

    car.is_available = false
    car.total_distance += rent.distance
    await this.carRepository.save(car)
    return newRent
  }

  async findAll(): Promise<Rent[]> {
    return await this.rentRepository.find({
      relations: {
        car: true,
      },
    })
  }

  async findActive(): Promise<Rent[]> {
    return await this.rentRepository.find({
      order: {
        start_date: 'asc',
      },
      where: {
        end_date: Raw((alias) => `${alias} > NOW()`),
      },
      relations: {
        car: true,
      },
    })
  }

  async remove(id: number): Promise<void> {
    const candidate = await this.rentRepository.findOne({
      where: { id },
      relations: { car: true },
    })
    if (!candidate) {
      throw new NotFoundException(`Rent with id ${id} not exists`)
    }
    if (candidate.car) {
      const car = {}
      Object.assign(car, candidate.car)
      Object.assign(car, {
        is_available: true,
      })
      console.log({ car, candidate })
      await this.carRepository.save(car)
    }
    await this.rentRepository.remove(candidate)
  }
}
