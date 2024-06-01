import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Request, Put } from '@nestjs/common';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';
import { EditarConductorDto } from './dto/update-conductor.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('conductor')
@Controller('conductor')
export class ConductorsController {
  constructor(
    private readonly authService: AuthService,
    @Inject('COMPANY_SERVICE') private clientCompany: ClientProxy,
    @Inject('USER_SERVICE') private clientUser: ClientProxy
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/query')
  async getConductors(@Request() req){
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
      .send({ cmd: 'get_conductors' }, params)
      .toPromise();
  }

  @ApiBearerAuth()
  @Get('/findbytipobyruta/:tipo_vehiculo/:ruta')
  async getConductorsByTipoByRuta(
    @Request() req,
    @Param('tipo_vehiculo') tipo_vehiculo,
    @Param('ruta') ruta,
  ){
    const requestData = req.query
    const filters = {};

    const params = {
      tipo_vehiculo,
      ruta
    }
    /* for (const key in requestData) {
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
    } */
    console.log(params)
    return await this.clientCompany
      .send({ cmd: 'get_conductors_bytipobyruta' }, params)
      .toPromise();
  }

  
  @ApiBearerAuth()
  @Get('/findtypevehiculo')
  async findTypeVehiculo(
    @Request() req,
  ) {
    return await this.clientCompany
      .send({ cmd: 'find_typevehiculo' }, {})
      .toPromise();
  }


  @ApiBearerAuth()
  @Get('/findruta/idtypevehiculo/:id_tipo_vehiculo')
  async findRutaByIdTypeVehiculo(
    @Request() req,
    @Param('id_tipo_vehiculo') id_tipo_vehiculo,
  ) {
    return await this.clientCompany
      .send({ cmd: 'find_ruta_by_idtypevehiculo' }, {id_tipo_vehiculo})
      .toPromise();
  }


  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/findruta/typevehiculo/:tipo_vehiculo')
  async findRutaByTypeVehiculo(
    @Request() req,
    @Param('tipo_vehiculo') tipo_vehiculo,
  ) {
    return await this.clientCompany
      .send({ cmd: 'find_ruta_by_typevehiculo' }, {tipo_vehiculo})
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/find/:id_conductor')
  async findConductorById(
    @Request() req,
    @Param('id_conductor') id_conductor,
  ) {
    return await this.clientCompany
      .send({ cmd: 'find_conductor_by_id' }, {id_conductor})
      .toPromise();
  }

  @ApiBearerAuth()
  @Get('/findweb/:id_conductor')
  async getConductorWebById(
    @Request() req,
    @Param('id_conductor') id_conductor,
  ) {
    return await this.clientCompany
      .send({ cmd: 'findweb_conductor_by_id' }, {id_conductor})
      .toPromise();
  }

  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Post('/add')
  async createConductor(@Body() createConductorDto: any, @Request() req) {
    console.log(req.user)
    createConductorDto.id_user_creador = req.user._id
    const userDto:CreateUserDto = {
      codigo_usuario:createConductorDto.num_documento,
      usuario:createConductorDto.apellidos,
      nombre_apellido: createConductorDto.nombres+' '+createConductorDto.apellidos,
      email: createConductorDto.email,
      contraseña:createConductorDto.num_documento,
      changecontraseña:createConductorDto.num_documento,
      roles:["CONDUCTOR"],
      avatar:createConductorDto.imagen_user
    }
    delete createConductorDto.imagen_user
    const userResult = await this.clientUser
      .send({ cmd: 'create_user' }, userDto)

      .toPromise();
    if(userResult){
      console.log(userResult)
      createConductorDto.id_user_responsable = userResult.data._id
      return await this.clientCompany
      .send({ cmd: 'create_conductor' }, createConductorDto)
      .toPromise();
    }else{
      console.log(userResult)
      /* createConductorDto.id_user_responsable = userResult.data._id
      return await this.clientCompany
      .send({ cmd: 'create_conductor' }, createConductorDto)
      .toPromise(); */
    }
    
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/edit/:id_conductor')
  async editConductor(@Body() editarConductorDto: any,@Param('id_conductor') id_conductor, @Request() req) {
    
    editarConductorDto.id_user_modificador = req.user._id
    // editarConductorDto.fe_modificacion = new Date(String(this.getDate()))
    if(editarConductorDto._id) delete editarConductorDto._id
    const params = {
      id_conductor:id_conductor,
      body:editarConductorDto
    }
    
    return await this.clientCompany
      .send({ cmd: 'editar_conductor' }, params)
      .toPromise();
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Delete('/delete/:id_conductor')
  async deleteConductorById(@Param('id_conductor') id_conductor) {
    return await this.clientCompany
      .send({ cmd: 'delete_conductor_by_id' }, {id_conductor})
      .toPromise();
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/activar/:id_conductor')
  async activarConductorById(@Param('id_conductor') id_conductor) {
    return await this.clientCompany
      .send({ cmd: 'activar_conductor_by_id' }, {id_conductor})
      .toPromise();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.clientCompany
      .send({ cmd: 'login' }, loginDto)
      .toPromise();

    if (result.email) {
      return this.authService.login(result);
    } else {
      return result;
    }
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/verify_token')
  async getConductor(@Request() req) {
    return req.conductor
  }



}
