import {
  Controller,
  UseGuards,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { RolesGuard } from './../roles/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('pais')
export class PaisController {
  constructor(@Inject('COMPANY_SERVICE') private clientCompany: ClientProxy) {}

  @Get()
  async getPaises(@Query() query: any) {
    const params = {
      query,
    };
    return await this.clientCompany
      .send({ cmd: 'get_paises' }, params)
      .toPromise();
  }

  @Post('create')
  async createPais(@Body() body: any) {
    const params = {
      body,
    };
    return await this.clientCompany
      .send({ cmd: 'create_pais' }, params)
      .toPromise();
  }

  @Post('create')
  async createPaises(@Body() body: any) {
    const params = {
      body,
    };
    return await this.clientCompany
      .send({ cmd: 'create_paises_array' }, params)
      .toPromise();
  }
}
