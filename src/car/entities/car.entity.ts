import { ApiProperty } from '@nestjs/swagger'
import { Rent } from 'src/rent/entities/rent.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Car {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column()
  model: string

  @ApiProperty()
  @Column()
  mark: string

  @ApiProperty()
  @Column()
  license_plate: string

  @ApiProperty()
  @Column()
  vin: string

  @ApiProperty()
  @OneToMany(() => Rent, (rent) => rent.car)
  rents: Rent[]

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  total_distance: number

  @ApiProperty()
  @Column({ type: 'bool', default: true })
  is_available: boolean
}
