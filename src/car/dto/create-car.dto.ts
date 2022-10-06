import { Rent } from 'src/rent/entities/rent.entity'

export class CreateCarDto {
  model: string
  mark: string
  license_plate: string
  vin: string
  current_rent?: [Rent]
  total_distance: number
  last_rent_date?: Date
}
