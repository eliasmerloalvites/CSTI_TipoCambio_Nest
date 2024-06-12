import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs'
import { Model } from 'mongoose';
import { ResUser, User, UserData } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';

const {calcular_paginacion,diferenciaDeFecha,formatearFechaYHora} = require('../functions/funciones');
const moment = require('moment');
const CryptoJS = require('crypto-js');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  getDate(): String {
    return moment().format('YYYY-MM-DD hh:mm A');
  }

  
  async getUsers(page: string,items_per_page: string, searchQuery: string, nameorder: string | null, order: string | null,filters:any | null): Promise<ResUser<UserData[]>> {
    try {
      var pag = parseInt(page);
      var limit = parseInt(items_per_page);
      var skip = (pag - 1) * limit;
      const ordenamiento = {};
      if(nameorder && order){
        const typeOrder:1|-1 = order==='asc'?1:-1
        ordenamiento[nameorder] = typeOrder
      }
      const query : any  = {};
      let searchFilter= {};
      if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, 'i');
        searchFilter = {
          $or: [
            { usuario: searchRegex },
            { nombre_apellido: searchRegex },
            { email: searchRegex },
            { roles: searchRegex }
          ],
        };
      }
      const arrayFilter = []
      if (Object.keys(searchFilter).length > 0) {
        arrayFilter.push(searchFilter)
        query.$and = arrayFilter;
      }
      if (Object.keys(filters).length > 0) {
        const filters_parseado= {};

        for (const key in filters) {
          const filterRegex = key === "status"?  new RegExp(`^${filters[key]}$`, 'i'): new RegExp(filters[key], 'i');
          
          filters_parseado[key] = filterRegex;
        }
        arrayFilter.push(filters_parseado)
        query.$and = arrayFilter;
      }
      // query.idproceso = mongoose.Types.ObjectId(processId);

      const usuario = await this.userModel
        .find(query)
        .select('-contraseña')
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(ordenamiento)
        .lean()
        .exec();

      const FechaActual:Date = new Date(String(this.getDate()));
      const usuariosResult= usuario.map(user => {
        let ultimaConexionData  = ''
        if(user.fe_conexion){
          const ultimaConexion: Date = new Date(user.fe_conexion);
          ultimaConexionData = diferenciaDeFecha(FechaActual,ultimaConexion)
        }else{
          ultimaConexionData = ''
        }
        const fechaFor = formatearFechaYHora(String(user.fe_creacion))
        return {
          ...user,
          ultima_conexion: ultimaConexionData,
          fecha_creacion: fechaFor
        };
      });

      

      var length = await this.userModel
      .countDocuments(query)
      .exec();

      const {To,From,prev_page_url,first_page_url,next_page_url,last_page,links} = calcular_paginacion(pag,limit,length)

      return {
        success: true,
        data: usuariosResult,
        payload: {
          pagination:{
            to:To,
            from:From,
            total:length,
            prev_page_url:prev_page_url,
            first_page_url:first_page_url,
            next_page_url:next_page_url,
            page: pag,
            last_page:last_page,
            items_per_page: limit,
            links
          },
          message: 'LISTA ENCONTRADA CORRECTAMENTE'
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        payload:{
          message: 'ALGO SALIO MAL'
        }
      };
    }
  }
  async getUserById(_id: string): Promise<ResUser<UserData>> {
    try {

      const usuario = await this.userModel
        .findById(_id)
        .select('_id codigo_usuario usuario email nombre_apellido roles')
        .lean()
        .exec();

      return {
        success: true,
        data: usuario,
        payload: {
          message: 'LISTA ENCONTRADA CORRECTAMENTE'
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        payload:{
          message: 'ALGO SALIO MAL'
        }
      };
    }
  }

  async findAllUser(): Promise<User[]> {
    return await this.userModel.find();
  }

  async createUser(userParams: User) {
    try {
      var success = true;
      const checkRole = [
        'ADMINISTRADOR',
        'SUPERVISOR',
        'CONDUCTOR',
        'USUARIO'
      ]
      const sonRolesPermitidos = userParams.roles.every(rol => checkRole.includes(rol));

      if (!sonRolesPermitidos) {
        success = false;
        return {
          success: success,
          data: null,
          message: 'ROLE INVALIDO',
        };
      }
      
      const validateUsuario = await this.userModel
        .findOne({ codigo_usuario: userParams.codigo_usuario })
        .lean()
        .exec();

      if (validateUsuario) {
        success = false;
        return {
          success: success,
          data: validateUsuario,
          message: 'EL USUARIO YA SE ENCUENTRA REGISTRADO',
        };
      } else {
        userParams.contraseña = CryptoJS.AES.encrypt(
          String(userParams.contraseña),
          'secret key 123'
        ).toString();
        /* userParams.id_pais = id_pais;
        userParams.id_user_creador = id_user; */
        userParams.fe_creacion = new Date(String(this.getDate()));
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
  
  
  async editarUser(id_user:string,userParams: any) {
    try {
      var success = true;
      var role = String(userParams.roles).toUpperCase();

      const checkRole = [
        'ADMINISTRADOR',
        'SUPERVISOR',
        'CONDUCTOR',
        'USUARIO'
      ]
      const sonRolesPermitidos = userParams.roles.every(rol => checkRole.includes(rol));
      if (!sonRolesPermitidos) {
        success = false;
        return {
          success: success,
          data: null,
          message: 'ROLE INVALIDO',
        };
      }
      if(userParams.avatar || userParams.avatar === "") delete userParams.avatar
      if(userParams.contraseña || userParams.contraseña === "") delete userParams.contraseña
      if(userParams.changecontraseña || userParams.changecontraseña === "") delete userParams.changecontraseña

      const result = await this.userModel
        .updateMany({ _id: id_user }, userParams)
        .exec();

      return {
        success: success,
        data: result,
        message: 'USUARIO ACTUALIZADO SATISFACTORIAMENTE',
      };

    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        message: error.message,
      };
    }

  }

  async deleteUserById(id_user: string) {
    try {
      var success = true;

        const result = await this.userModel
        .updateMany({ _id: id_user }, { status: 'DESACT' })
        .exec();

      return {
        success: success,
        data: result,
        message: 'USUARIO ELIMINADO CORRECTAMENTE',
      };
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        message: error.message,
      };
    }
  }
  
  async activarUserById(id_user: string) {
    try {
      var success = true;

        const result = await this.userModel
        .updateMany({ _id: id_user }, { status: 'ACT' })
        .exec();

      return {
        success: success,
        data: result,
        message: 'USUARIO ACTIVADO CORRECTAMENTE',
      };
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
      const validateUsuario = await this.userModel
        .findOne(
          { email: usuario, status: 'ACT' },
          '-latitud -longitud -fe_creacion -fe_modificacion -id_user_creador -id_user_modificador -fe_conexion -ul_latitud -ul_longitud -bateria',
        )
        .lean()
        .exec();

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
