import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  UseGuards,
  Request,
  Delete,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { EditarEmpresaDto } from './dto/update-user.dto';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(
    @Inject('COMPANY_SERVICE') private clientCompany: ClientProxy,
    @Inject('USER_SERVICE') private clientUser: ClientProxy,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/query')
  async getEmpresas(@Request() req, @Query() query) {
    const requestData = req.query
    const filters = {};

    for (const key in requestData) {
        if (key.startsWith('filter_')) {
            filters[key.replace('filter_', '')] = requestData[key];
        }
    }
    
    const params = {
      page:requestData.page||null,
      items_per_page:requestData.items_per_page||null,
      search:requestData.search||null,
      sort:requestData.sort||null,
      order:requestData.order||null,
      filters:filters||null,
    }

    return await this.clientCompany
      .send({ cmd: 'get_empresas' }, params)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/')
  async getAllEmpresas() {
    return await this.clientCompany
      .send({ cmd: 'get_all_empresas' }, {})
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/find/:id_empresa')
  async getEmpresaById(
    @Request() req,
    @Param('id_empresa') id_empresa,
  ) {
    
    return await this.clientCompany
      .send({ cmd: 'find_empresa_by_id' }, {id_empresa})
      .toPromise();
  }

  @Get('pending/:page')
  async getEmpresasPen(@Request() req, @Param('page') page) {
    const params = {
      page: page,
      query: {
        status: 'PEN',
      },
      id_pais: req.user.id_pais,
    };
    return await this.clientCompany
      .send({ cmd: 'get_empresas' }, params)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Post('/add')
  async createEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {

    return await this.clientCompany
      .send({ cmd: 'create_empresa' }, createEmpresaDto)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/edit/:id_empresa')
  async editarEmpresa(
    @Body() editarUserDto: EditarEmpresaDto,
    @Param('id_empresa') id_empresa
  ) {
    if(editarUserDto._id) delete editarUserDto._id
    const params = {
      id_empresa:id_empresa,
      body:editarUserDto
    }
    return await this.clientCompany
      .send({ cmd: 'editar_empresa' }, params)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Delete('/delete/:id_empresa')
  async deleteEmpresaById(@Param('id_empresa') id_empresa) {
    return await this.clientCompany
      .send({ cmd: 'delete_empresa_by_id' }, id_empresa)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/activar/:id_empresa')
  async activarEmpresaById(@Param('id_empresa') id_empresa) {
    return await this.clientCompany
      .send({ cmd: 'activar_empresa_by_id' }, {id_empresa})
      .toPromise();
  }




}
