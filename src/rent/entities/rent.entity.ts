import { ApiProperty } from '@nestjs/swagger'
import { Car } from 'src/car/entities/car.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Rent {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @ManyToOne(() => Car, (car) => car.rents)
  car: Car

  @ApiProperty()
  @CreateDateColumn()
  start_date: Date

  @ApiProperty()
  @Column()
  end_date: Date

  @ApiProperty()
  @Column()
  tariff: number

  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  total_sum?: number

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  distance?: number
}
