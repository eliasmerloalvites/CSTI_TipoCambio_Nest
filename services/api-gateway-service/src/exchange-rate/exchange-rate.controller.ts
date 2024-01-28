import { Controller, Get, Post, Body, Inject, UseGuards, Put, Param, Patch } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/exchange-rate.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CalcularExchangeRateDto } from './dto/calcular-exchange-rate.dto';
import { ExchangeRate, ExchangeRateInterface } from './interfaces/exchange-rate.interface';

@ApiTags('exchange-rates')
@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(    
    @Inject('COMPANY_SERVICE') private clientCompany: ClientProxy
    ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @Get()
  async getAllExchangeRates() {
    return await this.clientCompany
      .send({ cmd: 'get_all_exchange_rates' }, {})
      .toPromise();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createExchangeRate(@Body() createExchangeRateDto: CreateExchangeRateDto): Promise<{success:string,data:ExchangeRateInterface,message:string}> {    
    
    const result = await this.clientCompany
      .send({ cmd: 'create_exchange_rates' }, createExchangeRateDto)
      .toPromise();
    const data: ExchangeRate = new ExchangeRate(
      result.data.id,
      result.data.currencyFrom,
      result.data.currencyTo,
      result.data.rate
    );

    return { success: result.success, data, message: result.message };
  }

  

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Put('/:id')
  async editExchangeRate(@Param('id') id: number, @Body() createExchangeRateDto: CreateExchangeRateDto): Promise<{success:string,data:ExchangeRate,message:string}> {    
    
    const params = {
      id:+id,
      data:createExchangeRateDto
    }


    const result = await this.clientCompany
      .send({ cmd: 'edit_exchange_rates' }, params)
      .toPromise();
    const data: ExchangeRate = new ExchangeRate(
      result.data.id,
      result.data.currencyFrom,
      result.data.currencyTo,
      result.data.rate
    );

    return { success: result.success, data, message: result.message };
  }
  

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Bearer Auth',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post('/calcular')
  async calcularExchangeRate(@Body() calcularExchangeRateDto: CalcularExchangeRateDto): Promise<{success:string,data:ExchangeRateInterface,message:string}> {    

    return await this.clientCompany
      .send({ cmd: 'calcular_exchange_rates' }, calcularExchangeRateDto)
      .toPromise();
  }



}

