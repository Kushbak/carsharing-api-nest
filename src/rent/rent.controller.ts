import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { RentService } from './rent.service'
import { CreateRentDto } from './dto/create-rent.dto'
import {
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Rent } from './entities/rent.entity'

@ApiTags('rent')
@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @ApiOkResponse({
    description: 'All rents retrieved',
    type: Rent,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  async findAll(): Promise<Rent[]> {
    const rents = await this.rentService.findAll()
    return rents
  }

  @ApiOkResponse({
    description: 'All active rents retrieved',
    type: Rent,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('active')
  async findActive(): Promise<Rent[]> {
    const rent = await this.rentService.findActive()
    return rent
  }

  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post()
  async create(@Body() createRentDto: CreateRentDto) {
    const rent = await this.rentService.create(createRentDto)
    return rent
  }

  @ApiNoContentResponse({
    description: 'Rent by id deleted',
    status: 204,
  })
  @ApiNotFoundResponse({ description: 'No rent found for ID' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.rentService.remove(+id)
  }
}
