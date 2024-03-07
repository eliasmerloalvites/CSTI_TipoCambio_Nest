import { MiddlewareConsumer, Module } from '@nestjs/common';

//CONFIMODULE
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';


//CONTROLLERS
import { AppController } from './app/app.controller';
import { ExchangeRateController } from './exchange-rate/exchange-rate.controller';
import { UsersController } from './users/users.controller';

//SERVICIOS
import { AppService } from './app/app.service';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';


const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `environments/${env}.env`,
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    AppController,
    ExchangeRateController,
    UsersController
  ],
  providers: [
    AppService,
    AuthService,
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
    }
  ],
})
export class AppModule {}
