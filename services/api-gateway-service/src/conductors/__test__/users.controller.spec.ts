import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../conductors.controller';
import { AuthModule } from './../../auth/auth.module';
import { AuthService } from './../../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/create-conductor.dto';

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
      console.log(result)  
      expect(result.length>0).toEqual(true);
    });
  });

  describe('createUser', () => {
    it('must return data User', async () => {

      const object:CreateUserDto = {
        codigo_usuario: "12345678",
        usuario: "elias3@gmail.com",
        nombre_apellido: "elias3@gmail.com",
        email: "elias3@gmail.com",
        contraseña: "123456",
        roles:["ADMINISTRADOR"]
      }

      const result = await controller.createUser(object)
      expect(result.success).toEqual(true);

    });
  });

  

  describe('login', () => {
    it('must return data User', async () => {

      const object = {
        email: "elias@gmail.com",
        contraseña: "123456"
      }
      
      const result = await controller.login(object)
      expect(result.success).toEqual(true);

    });
  });


});
