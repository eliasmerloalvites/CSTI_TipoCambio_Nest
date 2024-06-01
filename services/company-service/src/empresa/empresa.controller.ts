import { Controller } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @MessagePattern({ cmd: 'get_all_empresas' })
  async getAllEmpresas(params: any) {
    return await this.empresaService.getAllEmpresas();
  }

  @MessagePattern({ cmd: 'get_empresas' })
  async getEmpresas(params: any) {
    return await this.empresaService.getEmpresas(
      params.page,params.items_per_page,params.search,params.sort,params.order,params.filters
    );
  }
  
  @MessagePattern({ cmd: 'find_empresa_by_id' })
  async getEmpresaById(params: any) {
    return await this.empresaService.getEmpresaById(params.id_empresa);
  }

  @MessagePattern({ cmd: 'create_empresa' })
  async createEmpresa(params: any) {
    return await this.empresaService.createEmpresa(
      params
    );
  }

  @MessagePattern({ cmd: 'editar_empresa' })
  async editarEmpresa(params: any) {
    return await this.empresaService.editarEmpresa(
      params.id_empresa,
      params.body,
    );
  }
  
  @MessagePattern({ cmd: 'delete_empresa_by_id' })
  async deleteEmpresaById(id_empresa: string) {
    return await this.empresaService.deleteEmpresaById(id_empresa);
  }

  @MessagePattern({ cmd: 'activar_empresa_by_id' })
  async cambiarStatusEmpresa(params: any) {
    return await this.empresaService.activarEmpresaById(
      params.id_empresa
    );
  }


}
