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
    console.log('start_date_weekday', dayjs(rent.start_date).toDate())
    if (WEEKDAYS.includes(start_date_weekday)) {
      throw new BadRequestException(`You may not start a rent on a weekend`)
    }
    const end_date_weekday = dayjs(rent.end_date).weekday()
    if (WEEKDAYS.includes(end_date_weekday)) {
      throw new BadRequestException(`You may not end a rent on a weekend`)
    }
  }

  private async checkForPauseBetweenRent(rent: CreateRentDto) {
    const carToRent = await this.carRepository.findOneBy({
      id: rent.car.id,
    })
    if (!carToRent) {
      throw new NotFoundException(`Car with id ${rent.car.id} not exists`)
    }

    const daysBetweenLastRent = dayjs(rent.start_date).diff(
      carToRent.last_rent_date,
      'day',
    )

    if (carToRent.last_rent_date && daysBetweenLastRent < 3) {
      throw new BadRequestException(
        'The pause between bookings should be 3 days',
      )
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
    const car = await this.carRepository.findOneBy({ id: createRentDto.car.id })
    if (car.current_rent) {
      throw new Error('Car is not available')
    }

    createRentDto.start_date = new Date(createRentDto.start_date)
    createRentDto.end_date = new Date(createRentDto.end_date)
    this.checkForMaxRentDay(createRentDto)
    this.checkForWeekdayRent(createRentDto)
    await this.checkForPauseBetweenRent(createRentDto)

    const rentDaysAmount = dayjs(createRentDto.end_date).diff(
      createRentDto.start_date,
      'day',
    )

    const tariff = this.tariffs.find((item) => item.id === createRentDto.tariff)
    createRentDto.total_sum = rentDaysAmount * tariff.price

    if (rentDaysAmount > 2) {
      createRentDto.total_sum = this.sumWithDiscount(
        createRentDto.total_sum,
        rentDaysAmount,
      )
    }

    const newRent = await this.rentRepository.save(createRentDto)
    const updatedCar = Object.assign(car, {
      current_rent: [newRent],
      last_rent_date: createRentDto.end_date,
    })

    await this.carRepository.save(updatedCar)
    return newRent
  }

  async findAll(): Promise<Rent[]> {
    return await this.rentRepository.find()
  }

  async findActive(): Promise<Rent[]> {
    return await this.rentRepository.find({
      order: {
        start_date: 'asc',
      },
      where: {
        end_date: Raw((alias) => `${alias} > NOW()`),
      },
    })
  }

  async remove(id: number): Promise<void> {
    const candidate = await this.rentRepository.findOneBy({ id })
    if (!candidate) {
      throw new NotFoundException(`Rent with id ${id} not exists`)
    }
    await this.rentRepository.remove(candidate)
  }
}
