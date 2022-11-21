import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { CreateCarDto } from './create-car.dto'

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @ApiProperty()
  model: string
  @ApiProperty()
  mark: string
  @ApiProperty()
  license_plate: string
  @ApiProperty()
  vin: string
  @ApiProperty()
  rents: []
  @ApiProperty()
  total_distance: number
  @ApiProperty()
  is_available: boolean
}
