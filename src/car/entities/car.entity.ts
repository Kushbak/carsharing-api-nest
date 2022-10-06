import { Rent } from 'src/rent/entities/rent.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
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

  @OneToMany(() => Rent, (rent) => rent.car)
  current_rent?: [Rent]

  @Column({ default: 0 })
  total_distance: number

  @Column({ nullable: true })
  last_rent_date?: Date
}
