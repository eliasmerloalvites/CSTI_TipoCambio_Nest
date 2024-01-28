import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from './entity/exchange-rate.entity';
import { CreateExchangeRateDto } from './dto/exchange-rate.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @MessagePattern({ cmd: 'get_all_exchange_rates' })
  async getAllExchangeRates(params: any) {
    return await this.exchangeRateService.findAll();
  }

  @MessagePattern({ cmd: 'create_exchange_rates' })
  async createExchangeRate(params: CreateExchangeRateDto) {
    return this.exchangeRateService.createExchangeRate(params);
  }

  @MessagePattern({ cmd: 'edit_exchange_rates' })
  async editExchangeRate(params: any) {
    return this.exchangeRateService.editExchangeRate(params.id,params.data);
  }  

  @MessagePattern({ cmd: 'calcular_exchange_rates' })
  async calcularExchangeRate(params: any) {
    return this.exchangeRateService.calcularExchangeRate(params);
  }

  


}

