import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateController } from './../exchange-rate.controller';
import { AuthModule } from './../../auth/auth.module';
import { AuthService } from './../../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateExchangeRateDto } from '../dto/exchange-rate.dto';
import { CalcularExchangeRateDto } from '../dto/calcular-exchange-rate.dto';
import { ExchangeRate, ExchangeRateInterface } from '../interfaces/exchange-rate.interface';

describe('ExchangeRateController', () => {
  let module: TestingModule;
  let controller : ExchangeRateController
  const env = process.env.NODE_ENV || 'development';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports:[ 
        AuthModule,       
        ConfigModule.forRoot({
          envFilePath: `environments/${env}.env`,
          isGlobal: true,
        })
      ],
      controllers: [ExchangeRateController],
      providers:[  
        AuthService,      
        {
          provide: 'COMPANY_SERVICE',
          inject: [ConfigService],
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.TCP,
              options: {
                host: String(process.env.COMPANY_HOST||'127.0.0.1'),
                port: Number(process.env.COMPANY_SERVICE_PORT||3002),
              },
            }),
        }
      ]
    }).compile();

    controller = module.get<ExchangeRateController>(ExchangeRateController)
  });

  describe('getAllExchangeRates', () => {
    it('must return data User', async () => {
      const result = await controller.getAllExchangeRates(); 
         
      expect(result.length>0).toEqual(true);
    });
  });

  describe('createExchangeRate', () => {
    it('must return data User', async () => {

      const object:CreateExchangeRateDto = {
        currencyFrom: "USD",
        currencyTo: "NEW",
        rate: 1.5
      }

      const result = await controller.createExchangeRate(object);

      console.log('Result:', result);

      expect(result.success).toEqual(true);
      expect(result.data).toBeDefined();
      expect(result.data instanceof ExchangeRate).toBe(true);
      

    });
  });


  describe('editExchangeRate', () => {
    it('must return data User', async () => {

      const object:CreateExchangeRateDto = {
        currencyFrom: "USD",
        currencyTo: "NEW",
        rate: 0.52
      }

      const result = await controller.editExchangeRate(1,object)
      expect(result.success).toEqual(true);

    });
  });
  
  describe('calcularExchangeRate', () => {
    it('must return data User', async () => {

      const object:CalcularExchangeRateDto = {
        amount:100,
        currencyFrom: "USD",
        currencyTo: "NEW"
      }

      const result = await controller.calcularExchangeRate(object)
      expect(result.success).toEqual(true);

    });
  });
  


});
