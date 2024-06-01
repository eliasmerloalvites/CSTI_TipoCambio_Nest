import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Request, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';
import { EditarUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
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
  async findAllUser(@Request() req){
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
    return await this.clientUser
      .send({ cmd: 'get_all_users' }, params)
      .toPromise();
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Get('/find/:id_user')
  async editarTarea(
    @Request() req,
    @Param('id_user') id_user,
  ) {
    return await this.clientUser
      .send({ cmd: 'find_user_by_id' }, {id_user})
      .toPromise();
  }

  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Post('/add')
  async createUser(@Body() createUserDto: CreateUserDto) {
    
    return await this.clientUser
      .send({ cmd: 'create_user' }, createUserDto)
      .toPromise();
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/edit/:id_user')
  async editUser(@Body() editarUserDto: EditarUserDto,@Param('id_user') id_user) {
    if(editarUserDto._id) delete editarUserDto._id
    const params = {
      id_user:id_user,
      body:editarUserDto
    }
    
    return await this.clientUser
      .send({ cmd: 'editar_user' }, params)
      .toPromise();
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Delete('/delete/:id_user')
  async deleteUserById(@Param('id_user') id_user) {
    return await this.clientUser
      .send({ cmd: 'delete_user_by_id' }, {id_user})
      .toPromise();
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Roles(Role.administradorGeneral)
  @ApiBearerAuth()
  @Put('/activar/:id_user')
  async activarUserById(@Param('id_user') id_user) {
    return await this.clientUser
      .send({ cmd: 'activar_user_by_id' }, {id_user})
      .toPromise();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.clientUser
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
  async getUser(@Request() req) {
    return req.user
  }



}
