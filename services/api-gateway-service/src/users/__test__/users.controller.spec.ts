import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './../users.controller';
import { AuthModule } from './../../auth/auth.module';
import { AuthService } from './../../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let module: TestingModule;
  let controller : UsersController
  const env = process.env.NODE_ENV || 'development';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports:[
        AuthModule,        
        ConfigModule.forRoot({
          envFilePath: `environments/${env}.env`,
          isGlobal: true,
        }),
      ],
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController)
  });

  describe('findAllUser', () => {
    it('must return data User', async () => {
      const result = await controller.findAllUser();      
      expect(result.length>0).toEqual(true);
    });
  });

  describe('createUser', () => {
    it('must return data User', async () => {

      const object:CreateUserDto = {
        name: "elias3",
        email: "elias3@gmail.com",
        password: "123456"
      }

      const result = await controller.createUser(object)
      expect(result.success).toEqual(true);

    });
  });

  

  describe('login', () => {
    it('must return data User', async () => {

      const object = {
        email: "elias@gmail.com",
        password: "123456"
      }
      
      const result = await controller.login(object)
      expect(result.success).toEqual(true);

    });
  });


});
