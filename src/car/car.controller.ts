import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import {
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CarService } from './car.service'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Car } from './entities/car.entity'

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiOkResponse({
    description: 'All cars retrieved',
    type: Car,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  async findAll() {
    const cars = await this.carService.findAll()
    return cars
  }

  @ApiOkResponse({
    description: 'Retrieved car by ID',
    type: Car,
  })
  @ApiNotFoundResponse({ description: 'No car found for ID' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const car = await this.carService.findOne(id)
    return car
  }

  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    const car = await this.carService.create(createCarDto)
    console.log({ createCarDto, car })
    return car
  }

  @ApiOkResponse({
    description: 'Updated car data by ID',
    type: Car,
  })
  @ApiNotFoundResponse({ description: 'No car found for ID' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    const car = await this.carService.update(+id, updateCarDto)
    return car
  }

  @ApiNoContentResponse({
    description: 'Rent by id deleted',
    status: 204,
  })
  @ApiNotFoundResponse({ description: 'No car found for ID' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.carService.remove(+id)
  }
}
