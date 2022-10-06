import { Module } from '@nestjs/common'
import { CarModule } from './car/car.module'
import { RentModule } from './rent/rent.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Rent } from './rent/entities/rent.entity'
import { Car } from './car/entities/car.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Rent, Car],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CarModule,
    RentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
