import { Rent } from 'src/rent/entities/rent.entity'

export class CreateCarDto {
  id: number
  model: string
  mark: string
  license_plate: string
  vin: string
  current_rent?: Rent
  total_distance: number
  last_rent_date: Date
}
