import { ApiProperty } from '@nestjs/swagger'

export class CreateRentDto {
  @ApiProperty()
  car_id: number
  @ApiProperty()
  start_date: Date
  @ApiProperty()
  end_date: Date
  @ApiProperty({
    enum: [1, 2, 3],
  })
  tariff: number
  @ApiProperty()
  distance: number
  @ApiProperty({ readOnly: true })
  total_sum?: number
}
