import { ApiProperty } from '@nestjs/swagger'

export class CreateCarDto {
  @ApiProperty()
  model: string
  @ApiProperty()
  mark: string
  @ApiProperty()
  license_plate: string
  @ApiProperty()
  vin: string
  @ApiProperty({ readOnly: true, default: [] })
  rents: []
  @ApiProperty({ default: 0 })
  total_distance: number
  @ApiProperty({ readOnly: true, type: 'bool', default: true })
  is_available: boolean
}
