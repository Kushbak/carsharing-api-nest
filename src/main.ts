import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const options = new DocumentBuilder()
    .setTitle('Car Sharing')
    .setDescription(`The Car Sharing API description`)
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 5050)
}
bootstrap()

// {
//   "model": "BMW",
//   "mark": "M5",
//   "license_plate": "777",
//   "vin": "777",
//   "total_distance": 0,
//   "is_available": true
// }
