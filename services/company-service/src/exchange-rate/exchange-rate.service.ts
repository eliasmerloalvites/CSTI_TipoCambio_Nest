import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entity/exchange-rate.entity';
import { CreateExchangeRateDto } from './dto/exchange-rate.dto';
import { CalcularExchangeRateDto } from './dto/calcular-exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {}
  
  onModuleInit() {
    const params = [
      {"id": 1, "currencyFrom": "USD", "currencyTo": "EUR", "rate": 0.85},
      {"id": 2, "currencyFrom": "USD", "currencyTo": "GBP", "rate": 0.74},
      {"id": 3, "currencyFrom": "USD", "currencyTo": "JPY", "rate": 110.25},
      {"id": 4, "currencyFrom": "EUR", "currencyTo": "GBP", "rate": 0.87},
      {"id": 5, "currencyFrom": "EUR", "currencyTo": "JPY", "rate": 129.5},
      {"id": 6, "currencyFrom": "EUR", "currencyTo": "USD", "rate": 1.18},
      {"id": 7, "currencyFrom": "GBP", "currencyTo": "EUR", "rate": 1.15},
      {"id": 8, "currencyFrom": "GBP", "currencyTo": "JPY", "rate": 149.2},
      {"id": 9, "currencyFrom": "GBP", "currencyTo": "USD", "rate": 1.35},
      {"id": 10, "currencyFrom": "JPY", "currencyTo": "EUR", "rate": 0.0077},
      {"id": 11, "currencyFrom": "JPY", "currencyTo": "GBP", "rate": 0.0067},
      {"id": 12, "currencyFrom": "JPY", "currencyTo": "USD", "rate": 0.0091},
      {"id": 13, "currencyFrom": "CAD", "currencyTo": "AUD", "rate": 1.03},
      {"id": 14, "currencyFrom": "CAD", "currencyTo": "USD", "rate": 0.79},
      {"id": 15, "currencyFrom": "AUD", "currencyTo": "CAD", "rate": 0.97},
      {"id": 16, "currencyFrom": "AUD", "currencyTo": "USD", "rate": 0.73},
      {"id": 17, "currencyFrom": "NZD", "currencyTo": "USD", "rate": 0.68},
      {"id": 18, "currencyFrom": "NZD", "currencyTo": "AUD", "rate": 0.63},
      {"id": 19, "currencyFrom": "CHF", "currencyTo": "EUR", "rate": 1.09},
      {"id": 20, "currencyFrom": "CHF", "currencyTo": "USD", "rate": 1.18},
      {"id": 21, "currencyFrom": "CNY", "currencyTo": "USD", "rate": 0.15},
      {"id": 22, "currencyFrom": "CNY", "currencyTo": "EUR", "rate": 0.13},
      {"id": 23, "currencyFrom": "SEK", "currencyTo": "EUR", "rate": 0.098},
      {"id": 24, "currencyFrom": "SEK", "currencyTo": "USD", "rate": 0.11},
      {"id": 25, "currencyFrom": "INR", "currencyTo": "USD", "rate": 0.014},
      {"id": 26, "currencyFrom": "INR", "currencyTo": "EUR", "rate": 0.012},
      {"id": 27, "currencyFrom": "BRL", "currencyTo": "USD", "rate": 0.18},
      {"id": 28, "currencyFrom": "BRL", "currencyTo": "EUR", "rate": 0.15},
      {"id": 29, "currencyFrom": "ZAR", "currencyTo": "USD", "rate": 0.067},
      {"id": 30, "currencyFrom": "ZAR", "currencyTo": "EUR", "rate": 0.057},
      {"id": 31, "currencyFrom": "USD", "currencyTo": "PEN", "rate": 3.78},
      {"id": 32, "currencyFrom": "EUR", "currencyTo": "PEN", "rate": 4.45},
      {"id": 33, "currencyFrom": "GBP", "currencyTo": "PEN", "rate": 5.11},
      {"id": 34, "currencyFrom": "JPY", "currencyTo": "PEN", "rate": 0.031},
      {"id": 35, "currencyFrom": "CAD", "currencyTo": "PEN", "rate": 2.87},
      {"id": 36, "currencyFrom": "AUD", "currencyTo": "PEN", "rate": 2.72},
      {"id": 37, "currencyFrom": "NZD", "currencyTo": "PEN", "rate": 2.32},
      {"id": 38, "currencyFrom": "CHF", "currencyTo": "PEN", "rate": 3.98},
      {"id": 39, "currencyFrom": "CNY", "currencyTo": "PEN", "rate": 0.98},
      {"id": 40, "currencyFrom": "SEK", "currencyTo": "PEN", "rate": 0.42},
      {"id": 41, "currencyFrom": "INR", "currencyTo": "PEN", "rate": 0.056},
      {"id": 42, "currencyFrom": "BRL", "currencyTo": "PEN", "rate": 0.66},
      {"id": 43, "currencyFrom": "ZAR", "currencyTo": "PEN", "rate": 0.23},
      {"id": 44, "currencyFrom": "PEN", "currencyTo": "USD", "rate": 0.26},
      {"id": 45, "currencyFrom": "PEN", "currencyTo": "EUR", "rate": 0.22},
      {"id": 46, "currencyFrom": "PEN", "currencyTo": "GBP", "rate": 0.2},
      {"id": 47, "currencyFrom": "PEN", "currencyTo": "JPY", "rate": 32.15},
      {"id": 48, "currencyFrom": "PEN", "currencyTo": "CAD", "rate": 0.35},
      {"id": 49, "currencyFrom": "PEN", "currencyTo": "AUD", "rate": 0.37},
      {"id": 50, "currencyFrom": "PEN", "currencyTo": "NZD", "rate": 0.43},
      {"id": 51, "currencyFrom": "PEN", "currencyTo": "CHF", "rate": 0.25},
      {"id": 52, "currencyFrom": "PEN", "currencyTo": "CNY", "rate": 1.02},
      {"id": 53, "currencyFrom": "PEN", "currencyTo": "SEK", "rate": 2.38},
      {"id": 54, "currencyFrom": "PEN", "currencyTo": "INR", "rate": 17.92},
      {"id": 55, "currencyFrom": "PEN", "currencyTo": "BRL", "rate": 1.51},
      {"id": 56, "currencyFrom": "PEN", "currencyTo": "ZAR", "rate": 4.36},
      {"id": 57, "currencyFrom": "USD", "currencyTo": "MXN", "rate": 20.09},
      {"id": 58, "currencyFrom": "EUR", "currencyTo": "MXN", "rate": 23.45},
      {"id": 59, "currencyFrom": "GBP", "currencyTo": "MXN", "rate": 27.18},
      {"id": 60, "currencyFrom": "JPY", "currencyTo": "MXN", "rate": 0.17},
      {"id": 61, "currencyFrom": "CAD", "currencyTo": "MXN", "rate": 15.65},
      {"id": 62, "currencyFrom": "AUD", "currencyTo": "MXN", "rate": 14.82},
      {"id": 63, "currencyFrom": "NZD", "currencyTo": "MXN", "rate": 13.54},
      {"id": 64, "currencyFrom": "CHF", "currencyTo": "MXN", "rate": 23.21},
      {"id": 65, "currencyFrom": "CNY", "currencyTo": "MXN", "rate": 5.67},
      {"id": 66, "currencyFrom": "SEK", "currencyTo": "MXN", "rate": 2.43},
      {"id": 67, "currencyFrom": "INR", "currencyTo": "MXN", "rate": 0.33},
      {"id": 68, "currencyFrom": "BRL", "currencyTo": "MXN", "rate": 3.9},
      {"id": 69, "currencyFrom": "ZAR", "currencyTo": "MXN", "rate": 11.28},
      {"id": 70, "currencyFrom": "MXN", "currencyTo": "USD", "rate": 0.05},
      {"id": 71, "currencyFrom": "MXN", "currencyTo": "EUR", "rate": 0.043},
      {"id": 72, "currencyFrom": "MXN", "currencyTo": "GBP", "rate": 0.037},
      {"id": 73, "currencyFrom": "MXN", "currencyTo": "JPY", "rate": 5.76},
      {"id": 74, "currencyFrom": "MXN", "currencyTo": "CAD", "rate": 0.064},
      {"id": 75, "currencyFrom": "MXN", "currencyTo": "AUD", "rate": 0.067},
      {"id": 76, "currencyFrom": "MXN", "currencyTo": "NZD", "rate": 0.074},
      {"id": 77, "currencyFrom": "MXN", "currencyTo": "CHF", "rate": 0.043},
      {"id": 78, "currencyFrom": "MXN", "currencyTo": "CNY", "rate": 0.18},
      {"id": 79, "currencyFrom": "MXN", "currencyTo": "SEK", "rate": 0.41},
      {"id": 80, "currencyFrom": "MXN", "currencyTo": "INR", "rate": 3.04},
      {"id": 81, "currencyFrom": "MXN", "currencyTo": "BRL", "rate": 0.26},
      {"id": 82, "currencyFrom": "MXN", "currencyTo": "ZAR", "rate": 0.089}
    ]
    this.exchangeRateRepository.save(params)
  }
  
  
  async findAll(): Promise<ExchangeRate[]> {
    return await this.exchangeRateRepository.find();
  }

  async createExchangeRate(params: CreateExchangeRateDto){
    try {
      var Success = true;

      const { currencyFrom, currencyTo, rate } = params
      const newExchangeRate = this.exchangeRateRepository.create({ currencyFrom, currencyTo, rate });
      
      const result = await this.exchangeRateRepository.save(newExchangeRate);

      return {
        success: Success,
        data: result,
        message: 'CREADO SATISFACTORIAMENTE',
      };
    } catch (error) {
      Success = false;
      return {
        success: Success,
        data: null,
        message: error.message,
      };
    }

    
  }

  async editExchangeRate(id:number , params: CreateExchangeRateDto) {

    try {
        var Success = true;       

        const { currencyFrom, currencyTo, rate } = params
        const updateResult = await this.exchangeRateRepository
            .update(
              { id: id },
              { 
                currencyFrom:currencyFrom,
                currencyTo:currencyTo,
                rate:rate,
              }
            );
            
        if (updateResult.affected > 0) {
          // Si fue exitosa, recuperar el objeto actualizado
          const objetoActualizado = await this.exchangeRateRepository.findOneBy({ id: id });
          
          return {
            success: Success,
            data: objetoActualizado,
            message: 'ACTUALIZADO SATISFACTORIAMENTE',
          };
        } else {
          // Si no se actualizó ningún registro
          throw new Error('No se encontró el registro para actualizar');
        }

    } catch (error) {
      Success = false;
      return {
        success: Success,
        data: null,
        message: error.message,
      };
    }

  }
  
  async calcularExchangeRate(params: CalcularExchangeRateDto) {

    try {
        var Success = true;       

        const { amount, currencyFrom, currencyTo } = params
        const found = await this.exchangeRateRepository.findOneBy({ currencyFrom: currencyFrom,currencyTo: currencyTo, });
        if (found) {
          // Si fue exitosa, recuperar el objeto actualizado
          
          const { id, ...data } = found;
          const result = {
            amount : amount,
            calculatedAmount : `${(amount*found.rate).toFixed(2)} ${found.currencyTo}`,
            ...data
          }
          return {
            success: Success,
            data: result,
            message: 'ACTUALIZADO SATISFACTORIAMENTE',
          };
        } else {
          // Si no se actualizó ningún registro
          throw new Error('No se encontró el tipo de cambio que deseas calcular');
        }
        console.log(found)
          return {
            success: Success,
            data: found,
            message: 'CALCULADO SATISFACTORIAMENTE',
          };
        /* if (updateResult.affected > 0) {
          // Si fue exitosa, recuperar el objeto actualizado
          const objetoActualizado = await this.exchangeRateRepository.findOneBy({ id: id });
          return {
            success: Success,
            data: objetoActualizado,
            message: 'ACTUALIZADO SATISFACTORIAMENTE',
          };
        } else {
          // Si no se actualizó ningún registro
          throw new Error('No se encontró el registro para actualizar');
        } */

    } catch (error) {
      Success = false;
      return {
        success: Success,
        data: null,
        message: error.message,
      };
    }

  }
  

}
