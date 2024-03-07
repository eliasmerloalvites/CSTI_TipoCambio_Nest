import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


//SCHEMAS
import { UserSchema } from './schemas/user.schema';

//ENTITIES
import { ExchangeRate } from './exchange-rate/entity/exchange-rate.entity'; 
import { User } from './users/entities/user.entity';

//CONTROLLER
import { ExchangeRateController } from './exchange-rate/exchange-rate.controller';
import { UsersController } from './users/users.controller';


//SERVICE
import { ExchangeRateService } from './exchange-rate/exchange-rate.service';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';



const env = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `environments/${env}.env`,
      isGlobal: true,
    }),   
    MongooseModule.forRoot(
      `${process.env.MONGO_URL}?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ])
  ],
  /* controllers: [
    ExchangeRateController,
    UsersController
  ],
  providers: [
    ExchangeRateService,
    UsersService
  ], */
})
export class AppModule {}
