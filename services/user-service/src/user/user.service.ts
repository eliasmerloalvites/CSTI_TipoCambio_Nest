import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs'
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
const moment = require('moment');
const CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  /*async onModuleInit() {
     const params  = {
      "codigo_usuario": "12345678",
      "usuario": "elias merlo",
      "nombre_apellido":"Abner Elias Merlo Alvites",
      "contraseña": "123456",
      "email": "elias@gmail.com",
      "roles":["ADMINISTRADOR"]
    }
    const usuario = await  this.userModel.create((params));
    this.createUser(usuario);
  } */

  getDate(): String {
    return moment().format('YYYY-MM-DD hh:mm A');
  }

  async findAllUser(): Promise<User[]> {
    return await this.userModel.find();
  }

  async createUser(userParams: User) {
    try {
      var success = true;
      var role = String(userParams.roles).toUpperCase();

      const checkRole = [
        'ADMINISTRADOR',
        'SUPERVISOR',
        'USUARIO'
      ].includes(role);

      if (!checkRole) {
        success = false;
        return {
          success: success,
          data: null,
          message: 'ROLE INVALIDO',
        };
      }

      const validateUsuario = await this.userModel
        .findOne({ usuario: userParams.usuario })
        .lean()
        .exec();

      if (validateUsuario) {
        success = false;
        return {
          success: success,
          data: null,
          message: 'EL USUARIO YA SE ENCUENTRA REGISTRADO',
        };
      } else {
        userParams.contraseña = CryptoJS.AES.encrypt(
          userParams.contraseña,
          'secret key 123',
        ).toString();
        /* userParams.id_pais = id_pais;
        userParams.id_user_creador = id_user; */
        userParams.fe_creacion = new Date(String(this.getDate()));
        userParams.roles = [role];
        const nuevoUsuario = await new this.userModel(userParams).save();

        return {
          success: success,
          data: nuevoUsuario,
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

  }
 
  async login(usuario: string, contraseña: string): Promise<any>  {
    try {
      var success = true;
      console.log(usuario)
      const validateUsuario = await this.userModel
        .findOne(
          { email: usuario, status: 'ACT' },
          '-latitud -longitud -fe_creacion -fe_modificacion -id_user_creador -id_user_modificador -fe_conexion -ul_latitud -ul_longitud -bateria',
        )
        .lean()
        .exec();
        console.log(validateUsuario)

      if (validateUsuario) {
        const { contraseña: pass, ...userValid } = validateUsuario;
        const decrypt = CryptoJS.AES.decrypt(pass, 'secret key 123').toString(
          CryptoJS.enc.Utf8,
        );
        const isMatch = contraseña === decrypt;
        if (isMatch) {
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
    return await this.userModel.findOne({ email });
  }
}
