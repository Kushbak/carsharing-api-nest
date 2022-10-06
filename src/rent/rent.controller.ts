import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { RentService } from './rent.service'
import { CreateRentDto } from './dto/create-rent.dto'

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  async create(@Body() createRentDto: CreateRentDto) {
    const rent = await this.rentService.create(createRentDto)
    return rent
  }

  @Get()
  async findAll() {
    const rents = await this.rentService.findAll()
    return rents
  }

  @Get('active')
  async findActive() {
    const rent = await this.rentService.findActive()
    return rent
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.rentService.remove(+id)
  }
}
