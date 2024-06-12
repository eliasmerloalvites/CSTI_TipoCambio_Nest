import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @MessagePattern({ cmd: 'find_all_user' })
  async findAllUser() {
    return await this.userService.findAllUser();
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getUsers(params: any) {
    return await this.userService.getUsers(params.page,params.items_per_page,params.search,params.sort,params.order,params.filters);
  }
  
  @MessagePattern({ cmd: 'find_user_by_id' })
  async getUserById(params: any) {
    return await this.userService.getUserById(params.id_user);
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(params: any) {
    return await this.userService.createUser(params);
  }  

  @MessagePattern({ cmd: 'editar_user' })
  async editarUser(params: any) {
    return await this.userService.editarUser(params.id_user,params.body);
  }

  @MessagePattern({ cmd: 'delete_user_by_id' })
  async deleteUserById(params: any) {
    return await this.userService.deleteUserById(params.id_user);
  }

  @MessagePattern({ cmd: 'activar_user_by_id' })
  async activarUserById(params: any) {
    return await this.userService.activarUserById(params.id_user);
  }

  @MessagePattern({ cmd: 'login' })
  async login(params: any): Promise<any>  {
    return await this.userService.login(params.email, params.contraseña);
  }




}
