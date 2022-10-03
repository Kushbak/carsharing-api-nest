import { PartialType } from '@nestjs/mapped-types'
import { Rent } from 'src/rent/entities/rent.entity'
import { CreateCarDto } from './create-car.dto'

export class UpdateCarDto extends PartialType(CreateCarDto) {
  id: number
  model: string
  mark: string
  license_plate: string
  vin: string
  current_rent?: Rent
  total_distance: number
  last_rent_date: Date
}
