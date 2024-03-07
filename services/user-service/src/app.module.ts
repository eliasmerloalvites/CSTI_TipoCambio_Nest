import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


//SCHEMAS
import { UserSchema } from './schemas/user.schema';

//ENTITIES


//USER
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

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
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-unique-validator'), {
            message: 'Error, el campo {PATH} debe ser unico.',
          });
          return schema;
        },
      },
    ])
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService
  ],
})
export class AppModule {}
