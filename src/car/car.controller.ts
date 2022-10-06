import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { CarService } from './car.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    console.log(createCarDto)
    const car = await this.carService.create(createCarDto)
    return car
  }

  @Get()
  async findAll() {
    const cars = await this.carService.findAll()
    return cars
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const car = await this.carService.findOne(id)
    return car
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    const car = await this.carService.update(+id, updateCarDto)
    return car
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.carService.remove(+id)
  }
}
