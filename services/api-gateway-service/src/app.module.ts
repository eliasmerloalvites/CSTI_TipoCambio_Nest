import { MiddlewareConsumer, Module } from '@nestjs/common';

//CONFIMODULE
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';


//CONTROLLERS
import { AppController } from './app/app.controller';
import { UsersController } from './users/users.controller';
import { ConductorsController } from './conductors/conductors.controller';
import { EmpresaController } from './empresa/empresa.controller';
import { PaisController } from './pais/pais.controller';

//SERVICIOS
import { AppService } from './app/app.service';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

//CHAT
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';


const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `environments/${env}.env`,
      isGlobal: true,
    }),
    AuthModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ConductorsController,
    EmpresaController,  
    PaisController,
    ChatController
  ],
  providers: [
    AppService,
    AuthService,
    ChatGateway,
    ChatService,
    {
      provide: 'USER_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: String(process.env.USER_HOST),
            port: Number(process.env.USER_SERVICE_PORT),
          },
        }),
    },
    {
      provide: 'COMPANY_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: String(process.env.COMPANY_HOST||'127.0.0.1'),
            port: Number(process.env.COMPANY_SERVICE_PORT||3002),
          },
        }),
    },
    {
      provide: 'CHAT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: String(process.env.CHAT_HOST||'127.0.0.1'),
            port: Number(process.env.CHAT_SERVICE_PORT||3003),
          },
        }),
    }
  ],
})
export class AppModule {}
