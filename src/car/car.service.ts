import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './entities/car.entity'

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async findAll() {
    return await this.carRepository.find({
      relations: {
        rents: true,
      },
    })
  }

  async findOne(id: number) {
    return await this.carRepository.findOne({
      where: { id },
      relations: {
        rents: true,
      },
    })
  }

  async create(newCar: CreateCarDto) {
    Object.assign(newCar, {
      rents: [],
    })
    return await this.carRepository.save(newCar)
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const candidate = await this.carRepository.findOne({ where: { id } })
    if (!candidate) {
      throw new NotFoundException(`Car with id ${id} not exists`)
    }
    const updatedCar = Object.assign(candidate, updateCarDto)
    return await this.carRepository.save(updatedCar)
  }

  async remove(id: number) {
    const candidate = await this.carRepository.findOne({ where: { id } })
    if (!candidate) {
      throw new NotFoundException(`Car with id ${id} not exists`)
    }
    await this.carRepository.remove(candidate)
  }
}
