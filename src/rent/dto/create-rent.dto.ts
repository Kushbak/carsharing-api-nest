import { Car } from 'src/car/entities/car.entity'

export class CreateRentDto {
  car: Car
  start_date: Date
  end_date: Date
  tariff: number
  distance?: number
  total_sum?: number
}
