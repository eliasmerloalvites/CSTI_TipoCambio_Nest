import { Controller } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('conductor')
export class ConductorController {
  constructor(private readonly conductorService: ConductorService) {}

  @MessagePattern({ cmd: 'get_all_conductors' })
  async getAllConductors(params: any) {
    return await this.conductorService.getAllConductors(
      params.page,params.items_per_page,params.search,params.sort,params.order,params.filters
    );
  }

  @MessagePattern({ cmd: 'get_conductors' })
  async getConductors(params: any) {
    return await this.conductorService.getConductors(
      params.page,params.items_per_page,params.search,params.sort,params.order,params.filters
    );
  }
  
  @MessagePattern({ cmd: 'get_conductors_bytipobyruta' })
  async getConductorsByTipoByRuta(params: any) {
    return await this.conductorService.getConductorsByTipoByRuta(
      params
    );
  }

  @MessagePattern({ cmd: 'find_conductor_by_id' })
  async findConductorById(params: any) {
    return await this.conductorService.findConductorById(params.id_conductor);
  }

  @MessagePattern({ cmd: 'findweb_conductor_by_id' })
  async getConductorWebById(params: any) {
    return await this.conductorService.getConductorWebById(params.id_conductor);
  }
  
  @MessagePattern({ cmd: 'find_typevehiculo' })
  async findTypeVehiculo() {
    return await this.conductorService.findTypeVehiculo();
  }

  @MessagePattern({ cmd: 'find_ruta_by_idtypevehiculo' })
  async findRutaByIdTypeVehiculo(params: any) {
    return await this.conductorService.findRutaByIdTypeVehiculo(params.id_tipo_vehiculo);
  }

  @MessagePattern({ cmd: 'find_ruta_by_typevehiculo' })
  async findRutaByTypeVehiculo(params: any) {
    return await this.conductorService.findRutaByTypeVehiculo(params.tipo_vehiculo);
  }

  @MessagePattern({ cmd: 'create_conductor' })
  async createConductor(params: any) {
    return await this.conductorService.createConductor(
      params
    );
  }

  @MessagePattern({ cmd: 'editar_conductor' })
  async editarConductor(params: any) {
    return await this.conductorService.editarConductor(
      params.id_conductor,
      params.body,
    );
  }
  
  
  @MessagePattern({ cmd: 'delete_conductor_by_id' })
  async deleteConductorById(params: any) {
    return await this.conductorService.deleteConductorById(params.id_conductor);
  }

  @MessagePattern({ cmd: 'activar_conductor_by_id' })
  async cambiarStatusConductor(params: any) {
    return await this.conductorService.activarConductorById(
      params.id_conductor
    );
  }
}
