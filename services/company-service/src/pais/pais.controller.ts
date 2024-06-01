import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaisService } from './pais.service';

@Controller('pais')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @MessagePattern({ cmd: 'get_paises' })
  async getPaises(params: any) {
    return await this.paisService.getPaises(params.query);
  }

  @MessagePattern({ cmd: 'create_pais' })
  async createPais(params: any) {
    return await this.paisService.createPais(params.body);
  }

  @MessagePattern({ cmd: 'create_paises_array' })
  async createPaisesArray(params: any) {
    return await this.paisService.createPaisesArray(params.body);
  }
}
