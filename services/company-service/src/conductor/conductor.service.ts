import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Conductor, ConductorData, ResConductor } from './interfaces/conductor.interface';
const {calcular_paginacion,diferenciaDeFecha,formatearFechaYHora} = require('../functions/funciones');

import axios from 'axios';
import { ResRuta, Ruta, RutaData } from './interfaces/ruta.interface';
const moment = require('moment');

@Injectable()
export class ConductorService {
  constructor(
    @InjectModel('Conductor') private conductorModel: Model<Conductor>,
    @InjectModel('Ruta') private rutaModel: Model<Ruta>
  ) {}

  getDate(): String {
    return moment().format('YYYY-MM-DD');
  }

  async getAllConductors(page: string,items_per_page: string, searchQuery: string, nameorder: string | null, order: string | null,filters:any | null): Promise<ResConductor<ConductorData[]>> {
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

      const conductor = await this.conductorModel
        .find(query)
        .select('-licencia -vehiculo.documento_inspeccion -vehiculo.documento_seguro -vehiculo.imagen')
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(ordenamiento)
        .lean()
        .exec();      

      var length = await this.conductorModel
      .countDocuments(query)
      .exec();

      const {To,From,prev_page_url,first_page_url,next_page_url,last_page,links} = calcular_paginacion(pag,limit,length)

      return {
        success: true,
        data: conductor,
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

  async getConductors(page: string,items_per_page: string, searchQuery: string, nameorder: string | null, order: string | null,filters:any | null): Promise<ResConductor<ConductorData[]>> {
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
            { nombres: searchRegex },
            { apellidos: searchRegex },
            { email: searchRegex }
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


        const results = await this.conductorModel
        .find(query)
        .populate('id_empresa','nombre')
        .select('-licencia -vehiculo.documento_inspeccion -vehiculo.documento_seguro -vehiculo.imagen')
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(ordenamiento)
        .lean()
        .exec();

        var length = await this.conductorModel
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
  
  async getConductorsByTipoByRuta(options:any): Promise<ResConductor<ConductorData[]>> {
    try {
        console.log(options)
        var pag = parseInt(options.page);
        var limit = parseInt(options.items_per_page);
        var skip = (pag - 1) * limit;
        const ordenamiento = {};
        if(options.nameorder && options.order){
          const typeOrder:1|-1 = options.order==='asc'?1:-1
          ordenamiento[options.nameorder] = typeOrder
        }
        const query : any  = {};
        let searchFilter= {};
        if (options.searchQuery) {
          const searchRegex = new RegExp(options.searchQuery, 'i');
          searchFilter = {
            $or: [
              { nombres: searchRegex },
              { apellidos: searchRegex },
              { email: searchRegex }
            ],
          };
        }
        const arrayFilter = []
        if (Object.keys(searchFilter).length > 0) {
          arrayFilter.push(searchFilter)
          query.$and = arrayFilter;
        }
        if (Object.keys(options.filters).length > 0) {
          const filters_parseado= {};

          for (const key in options.filters) {
            const filterRegex = key === "status"?  new RegExp(`^${options.filters[key]}$`, 'i'): new RegExp(options.filters[key], 'i');
            
            filters_parseado[key] = filterRegex;
          }
          arrayFilter.push(filters_parseado)
          query.$and = arrayFilter;
        }

        const results = await this.conductorModel
        .find({
          "vehiculo.tipo_vehiculo":options.tipo_vehiculo,
          "vehiculo.servicio.rutas":options.ruta
        })
        .populate('id_empresa','nombre')
        .populate('id_user_responsable','avatar')
        .select('account_type apellidos nombres vehiculo.servicio.rutas id_empresa id_user_responsable ')
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(ordenamiento)
        .lean()
        .exec();

        var length = await this.conductorModel
        .countDocuments({
          "vehiculo.tipo_vehiculo":options.tipo_vehiculo,
          "vehiculo.servicio.rutas":options.ruta
        })
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

  async findConductorById(_id: string): Promise<ResConductor<ConductorData>> {
    try {

      const empresa = await this.conductorModel
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
  
  async getConductorWebById(_id: string): Promise<ResConductor<ConductorData>> {
    try {

      const empresa = await this.conductorModel
        .findById(_id)
        .populate('id_empresa','nombre')
        .populate('id_user_responsable','avatar')
        .select('-licencia -vehiculo.documento_inspeccion -vehiculo.documento_seguro -vehiculo.imagen')
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
  
  async getConductorImagenesWebById(_id: string): Promise<ResConductor<ConductorData>> {
    try {

      const empresa = await this.conductorModel
        .findById(_id)
        .select('vehiculo.imagen')
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
  
  async findTypeVehiculo(): Promise<ResRuta<RutaData[]>> {
    try {

      const rutas = await this.rutaModel
        .find()
        .select('tipo_vehiculo color descripcion')
        .lean()
        .exec();

      return {
        success: true,
        data:rutas ,
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

  
  async findRutaByIdTypeVehiculo(_id: string): Promise<ResRuta<RutaData>> {
    try {

      const rutas = await this.rutaModel
        .findOne({_id})
        .lean()
        .exec();

      return {
        success: true,
        data:rutas ,
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

  async findRutaByTypeVehiculo(tipo_vehiculo: string): Promise<ResRuta<RutaData[]>> {
    try {

      const rutas = await this.rutaModel
        .find({tipo_vehiculo:tipo_vehiculo})
        .lean()
        .exec();

      return {
        success: true,
        data:rutas ,
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

  async createConductor(
    conductorParams: Conductor
  ) {
    try {
      let message = 'CONDUCTOR CREADA SATISFACTORIAMENTE';

      /* if( conductorParams.imagen != "" || conductorParams.imagen != null){
        if(String(conductorParams.imagen).includes('data:image/png;base64,')){
          const name = conductorParams.nombre_conductor+'/logo.jpg';
          var url = String(conductorParams.imagen).replace('data:image/png;base64,','');
          const image = await uploadToBucket(name,url)
          conductorParams.imagen = image.Location
        }
      } */
      console.log(conductorParams)

      var success = true;
      conductorParams.vehiculo[0].fecha_vencimiento_soat = new Date(conductorParams.vehiculo[0].fecha_vencimiento_soat);;
      conductorParams.fe_creacion = new Date(String(this.getDate()));
      const nuevaConductor = await new this.conductorModel(conductorParams).save();

      return {
        success: success,
        data: nuevaConductor,
        message,
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

  async editarConductor(id_conductor: string, body: Conductor) {
    try {
      var success = true;

      const find = await this.conductorModel
        .find({ num_documento: body.num_documento })
        .exec();
      if (find.length > 0 && find[0]._id != id_conductor) {
        return {
          success: success,
          data: null,
          message: 'EL RUC YA ESTA REGISTRADO',
        };
      }
      let rutaImagen = ""
      /* if(body.imagen != "" || body.imagen != null){
        if(String(body.imagen).includes('data:image/png;base64,')){
          const name = find[0].nombre_conductor+'/logo.jpg';
          var url = String(body.imagen).replace('data:image/png;base64,','');
          const image = await uploadToBucket(name,url)
          rutaImagen = image.Location
        }else{
          rutaImagen = body.imagen
        }
      } */

      const result = await this.conductorModel
        .findByIdAndUpdate(
          id_conductor,
          {
            ...body,
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
        message: 'CONDUCTOR CREADA SATISFACTORIAMENTE',
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
  
  async addArchivoConductor(id_user: string, id_conductor: string, body: any) {
    try {
      var success = true;

      /* const NombreFIle = this.NombreFileS3(body.num_documento,body.nombre_conductor,id_user,body.name_archivo)           
      const resultado = await uploadToBucket(NombreFIle, body.data_archivo) 
      const Archivo = {
        name: body.name_archivo,
        url:resultado.Location
      }

      const result = await this.conductorModel
        .findByIdAndUpdate(
          id_conductor,
          {
            $push:{
              archivos : Archivo
            }
          },
          {
            useFindAndModify: false,
            new: true,
          },
        )
        .exec(); */

      return {
        success: success,
        data: [],
        message: 'CONDUCTOR CREADA SATISFACTORIAMENTE',
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
  
  async quitarArchivoConductor(id_user: string, id_conductor: string, body: any) {
    try {
      var success = true;

      const result = await this.conductorModel
        .findByIdAndUpdate(
          id_conductor,
          {
            $pull:{
              archivos : body
            }
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
        message: 'ARCHIVO ELIMINADO EXITOSAMENTE',
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

  async deleteConductorById(id_conductor: string) {
    try {
      var success = true;
      console.log(id_conductor)
      const result = await this.conductorModel
      .updateMany({ _id: id_conductor }, { status: 'DESACT' })
      .exec();
      return {
        success: success,
        data: result,
        message: 'CONDUCTOR ELIMINADO CORRECTAMENTE',
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

  async activarConductorById(id_conductor: string) {
    try {
      var success = true;
      const result = await this.conductorModel
      .updateMany({ _id: id_conductor }, { status: 'ACT' })
      .exec();

      return {
        success: success,
        data: result,
        message: 'CONDUCTOR SE A ACTIVADO CORRECTAMENTE',
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



  async getMisConductors(id_conductors: Array<String>) {
    try {
      var success = true;

      const results = await this.conductorModel
        .find({ _id: { $in: id_conductors } })
        .exec();

      return {
        success: success,
        data: results,
        message: 'CONSULTA SATISFACTORIA',
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
  

  
  NombreFileS3 (ruc: string,id_conductor: string,id_user: string,nom: string){
    var today = new Date();
    var now = today.toLocaleString();
    var fecEspacios =  now.replace('/', "");
    var fecEspacios =  fecEspacios.replace('/', "");
    var fec = fecEspacios.replace(/:| /g, "");
    /* const key = moment(fe_creacion).format('YYYY/MM/DD'); */
    const name = id_conductor+'/'+nom;
    return name;
  }

}
