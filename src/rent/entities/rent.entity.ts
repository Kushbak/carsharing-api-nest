import { Car } from 'src/car/entities/car.entity'
import { Tariff } from 'src/tariff/entities/tariff.entity'
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export class Rent {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Car, (car) => car.current_rent)
  car: Car

  @CreateDateColumn()
  start_date: Date

  @Column()
  end_date: Date

  @ManyToOne(() => Tariff, (tariff) => tariff)
  tariff: Tariff

  @Column()
  distance: number
}
