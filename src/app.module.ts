import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CarModule } from './car/car.module'
import { TariffModule } from './tariff/tariff.module'
import { RentModule } from './rent/rent.module'

@Module({
  imports: [CarModule, TariffModule, RentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
