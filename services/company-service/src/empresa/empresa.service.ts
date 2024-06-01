import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa, EmpresaData, ResEmpresa } from './interfaces/empresa.interface';
const {calcular_paginacion,diferenciaDeFecha,formatearFechaYHora} = require('../functions/funciones');
// const {uploadToBucket} = require('../functions/s3Test');
import axios from 'axios';
const moment = require('moment');

@Injectable()
export class EmpresaService {
  constructor(@InjectModel('Empresa') private empresaModel: Model<Empresa>) {}

  getDate(): String {
    return moment().format('YYYY-MM-DD');
  }

  async getAllEmpresas() {
    try {

        const results = await this.empresaModel
        .find({status:"ACT"})
        .select('nombre')
        .lean()
        .exec();
        console.log(results)
        return {
          success: true,
          data: results,
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

  async getEmpresas(page: string,items_per_page: string, searchQuery: string, nameorder: string | null, order: string | null,filters:any | null): Promise<ResEmpresa<EmpresaData[]>> {
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


        const results = await this.empresaModel
        .find(query)
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(ordenamiento)
        .lean()
        .exec();

        var length = await this.empresaModel
        .countDocuments(query)
        .exec();

        const {To,From,prev_page_url,first_page_url,next_page_url,last_page,links} = calcular_paginacion(pag,limit,length)

        return {
          success: true,
          data: results,
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

  async getEmpresaById(_id: string): Promise<ResEmpresa<EmpresaData>> {
    try {

      const empresa = await this.empresaModel
        .findById(_id)
        .select("-__v -fe_creacion -fe_modificacion")
        .lean()
        .exec();

      return {
        success: true,
        data: empresa,
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

  async createEmpresa(
    empresaParams: Empresa
  ) {
    try {
      let message = 'EMPRESA CREADA SATISFACTORIAMENTE';

      /* if( empresaParams.imagen != "" || empresaParams.imagen != null){
        if(String(empresaParams.imagen).includes('data:image/png;base64,')){
          const name = empresaParams.nombre_empresa+'/logo.jpg';
          var url = String(empresaParams.imagen).replace('data:image/png;base64,','');
          const image = await uploadToBucket(name,url)
          empresaParams.imagen = image.Location
        }
      } */
      

      var success = true;
      empresaParams.fe_creacion = new Date(String(this.getDate()));

      const validateEmpresa = await this.empresaModel
        .findOne({ nombre: empresaParams.nombre })
        .lean()
        .exec();

      if (validateEmpresa) {
        success = false;
        return {
          success: success,
          data: null,
          payload: {
            message: 'LA EMPRESA YA SE ENCUENTRA REGISTRADO'
          }
        };
      } else {
        const nuevaEmpresa = await new this.empresaModel(empresaParams).save();

        return {
          success: success,
          data: nuevaEmpresa,
          payload: {
            message: 'EMPRESA CREADO SATISFACTORIAMENTE'
          }
        };
      }
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        payload: {
          message: error.message
        }
      };
    }
  }

  async editarEmpresa(id_empresa: string, body: Empresa) {
    try {
      var success = true;

      const find = await this.empresaModel
        .find({ nombre: body.nombre })
        .exec();

      if (find.length > 0 && find[0]._id != id_empresa) {
        return {
          success: false,
          data: null,
          payload: {
            message: 'LA EMPRESA YA ESTA REGISTRADA'
          }
        };
      }
      let rutaImagen = ""
      /* if(body.imagen != "" || body.imagen != null){
        if(String(body.imagen).includes('data:image/png;base64,')){
          const name = find[0].nombre_empresa+'/logo.jpg';
          var url = String(body.imagen).replace('data:image/png;base64,','');
          const image = await uploadToBucket(name,url)
          rutaImagen = image.Location
        }else{
          rutaImagen = body.imagen
        }
      } */

      const result = await this.empresaModel
        .findByIdAndUpdate(
          id_empresa,
          {
            nombre: body.nombre,
            descripcion: body.descripcion,
            imagen: body.imagen,
            fe_modificacion:new Date(String(this.getDate()))
          },
          {
            useFindAndModify: false,
            new: true,
          },
        )
        .exec();

      return {
        success: success,
        data: result,
        payload: {
          message: 'EMPRESA CREADA SATISFACTORIAMENTE'
        }
      };
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        payload: {
          message: error.message
        }
      };
    }
  }

  async deleteEmpresaById(id_empresa: string) {
    try {
      var success = true;

      const result = await this.empresaModel
      .updateMany({ _id: id_empresa }, { status: 'DESACT' })
      .exec();

      return {
        success: success,
        data: result,
        payload: {
          message: 'EMPRESA DESATIVADO CORRECTAMENTE'
        }
      };
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        payload: {
          message: error.message
        }
      };
    }
  }

  async activarEmpresaById(id_empresa: string) {
    try {
      var success = true;

      const result = await this.empresaModel
      .updateMany({ _id: id_empresa }, { status: 'ACT' })
      .exec();

      return {
        success: success,
        data: result,
        payload: {
          message: 'EMPRESA ACTIVADO CORRECTAMENTE'
        }
      };
    } catch (error) {
      success = false;
      return {
        success: success,
        data: null,
        payload: {
          message: error.message
        }
      };
    }
  }


  
  NombreFileS3 (ruc: string,id_empresa: string,id_user: string,nom: string){
    var today = new Date();
    var now = today.toLocaleString();
    var fecEspacios =  now.replace('/', "");
    var fecEspacios =  fecEspacios.replace('/', "");
    var fec = fecEspacios.replace(/:| /g, "");
    /* const key = moment(fe_creacion).format('YYYY/MM/DD'); */
    const name = id_empresa+'/'+nom;
    return name;
  }

}
