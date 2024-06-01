import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Pais,
  PaisDto,
  PaisOptions,
  ResPais,
} from './interfaces/pais.interface';

@Injectable()
export class PaisService {
  constructor(@InjectModel('Pais') private paisModel: Model<Pais>) {}

  async getPaises(options: PaisOptions): Promise<ResPais<Pais[]>> {
    try {
      const opts: any = { ...options };
      if (options.nombre_pais) {
        const regex = {
          $regex: new RegExp(`.*${options.nombre_pais}.*`),
          $options: 'i',
        };
        opts.nombre_pais = regex;
      }

      const paises = await this.paisModel
        .find()
        .select('-status')
        .lean()
        .exec();

      return {
        success: true,
        data: paises,
        message: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'ALGO SALIO MAL',
      };
    }
  }

  async createPais(pais: PaisDto): Promise<ResPais<Pais>> {
    try {
      const found = await this.paisModel
        .find({ nombre_pais: pais.nombre_pais })
        .select('nombre_pais')
        .lean()
        .exec();

      if (found.length > 0) {
        return {
          success: false,
          data: null,
          message: 'El nombre del Pais ya ha sido registrado',
        };
      }

      const lastPais = await this.paisModel
        .find()
        .select('codigo_pais')
        .sort('-codigo_pais')
        .exec();

      const index = (Number(lastPais[0]?.codigo_pais) || 0) + 1;

      const nuevoPais = await this.paisModel.create({
        ...pais,
        codigo_pais: index,
      });

      return {
        success: true,
        data: nuevoPais,
        message: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'ALGO SALIO MAL',
      };
    }
  }

  async createPaisesArray(paisesParams: PaisDto[]): Promise<ResPais<Pais[]>> {
    try {
      const lastPais = await this.paisModel
        .find()
        .select('codigo_pais')
        .sort('-codigo_pais')
        .exec();

      const index = (Number(lastPais[0]?.codigo_pais) || 0) + 1;

      const paises = await Promise.all(
        paisesParams.map(async ({ nombre_pais }, i) => {
          const found = await this.paisModel
            .findOne({ nombre_pais })
            .select('nombre_pais')
            .lean()
            .exec();

          if (found) {
            return found;
          }

          const nuevoPais = await this.paisModel.create({
            nombre_pais,
            codigo_pais: index + i,
          });
          return nuevoPais;
        }),
      );

      return {
        success: true,
        data: paises,
        message: null,
      };
    } catch (error) {
      return {
        success: true,
        data: null,
        message: 'ALGO SALIO MAL',
      };
    }
  }
}
