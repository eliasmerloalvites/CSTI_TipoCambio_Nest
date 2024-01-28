import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
//ENTITIES
import { ExchangeRate } from './exchange-rate/entity/exchange-rate.entity'; 
import { User } from './users/entities/user.entity';

//CONTROLLER
import { ExchangeRateController } from './exchange-rate/exchange-rate.controller';
import { UsersController } from './users/users.controller';


//SERVICE
import { ExchangeRateService } from './exchange-rate/exchange-rate.service';
import { UsersService } from './users/users.service';



const env = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `environments/${env}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [ExchangeRate,User], // Agrega tu entidad a la configuración
      synchronize: true, // Esto creará automáticamente las tablas en memoria
    }),
    TypeOrmModule.forFeature([ExchangeRate,User]),
  ],
  controllers: [
    ExchangeRateController,
    UsersController
  ],
  providers: [
    ExchangeRateService,
    UsersService
  ],
})
export class AppModule {}
