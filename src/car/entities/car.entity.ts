import { Rent } from 'src/rent/entities/rent.entity'
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

export class Car {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  model: string

  @Column()
  mark: string

  @Column()
  license_plate: string

  @Column()
  vin: string

  @ManyToOne(() => Rent, (rent) => rent.car)
  current_rent?: Rent

  @Column({ default: 0 })
  total_distance: number

  @Column()
  last_rent_date?: Date
}
