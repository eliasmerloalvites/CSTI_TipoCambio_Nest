import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'
// const CryptoJS = require('crypto-js');

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  onModuleInit() {
    const params = {
      "name": "elias merlo",
      "email": "elias@gmail.com",
      "password": "123456"
    }
    this.createUser(params);
  }

  async findAllUser(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      var success = true;
      const validateUsuario = await this.usersRepository
        .findOneBy({ email:createUserDto.email })

      if (validateUsuario) {
        success = false;
        return {
          success: success,
          data: null,
          message: 'EL USUARIO YA SE ENCUENTRA REGISTRADO',
        };
      } else {
        createUserDto.password = await bcryptjs.hash(createUserDto.password,10)
        const usuario = await  this.usersRepository.create((createUserDto));
        const usuarioCreado = await this.usersRepository.save(usuario)

        return {
          success: success,
          data: usuarioCreado,
          message: 'USUARIO CREADO SATISFACTORIAMENTE',
        };
      }
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        message: error.message,
      };
    }

    return await this.usersRepository.save(createUserDto);
  }

  async login(email: string, contraseña: string) {
    try {
      var success = true;
      const validateUsuario = await this.usersRepository
      .findOneBy({ email:email })

      if (validateUsuario) {
        const { password: pass, ...userValid } = validateUsuario;
        const isPasswordValid = await bcryptjs.compare(contraseña,pass)

        if (isPasswordValid) {
          return userValid;
        } else {
          success = false;
          return {
            success: success,
            data: null,
            message: 'CONTRASEÑA ES INCORRECTA',
          };
        }
      } else {
        success = false;
        return {
          success: success,
          data: null,
          message: 'USUARIO NO ENCONTRADO',
        };
      }
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        message: error.message,
      };
    }
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
