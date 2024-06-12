import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

//ENTITIES


//USER
import { UserSchema } from './user/schemas/user.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';


import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { Message, MessageSchema } from './chat/schemas/message.schema';



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
      { name: Message.name,
        useFactory: () => {
          const schema = MessageSchema;
          schema.plugin(require('mongoose-unique-validator'), {
            message: 'Error, el campo {PATH} debe ser unico.',
          });
          return schema;
        }, 
      }, 
    ])
  ],
  controllers: [
    UserController,
    ChatController
  ],
  providers: [
    UserService,
    ChatService
  ],
})
export class AppModule {}
