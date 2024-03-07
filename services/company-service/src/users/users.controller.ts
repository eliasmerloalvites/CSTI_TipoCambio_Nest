import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @MessagePattern({ cmd: 'find_all_user' })
  async findAllUser(): Promise<User[]>  {
    return await this.usersService.findAllUser();
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(params: any) {
    return await this.usersService.createUser(params);
  }

  @MessagePattern({ cmd: 'login' })
  async login(params: any) {
    console.log("que pasa company")
    console.log(params)
    return await this.usersService.login(params.email, params.password);
  }


}
