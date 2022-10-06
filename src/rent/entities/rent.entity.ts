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
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Car, (car) => car.current_rent)
  car: Car

  @CreateDateColumn()
  start_date: Date

  @Column()
  end_date: Date

  @Column()
  tariff: number

  @Column({ type: 'float', nullable: true })
  total_sum?: number
}
