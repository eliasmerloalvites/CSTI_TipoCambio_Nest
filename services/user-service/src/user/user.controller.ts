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

  @MessagePattern({ cmd: 'create_user' })
  async createUser(params: any) {
    return await this.userService.createUser(params);
  }

  @MessagePattern({ cmd: 'login' })
  async login(params: any): Promise<any>  {
    return await this.userService.login(params.email, params.contraseña);
  }




}
