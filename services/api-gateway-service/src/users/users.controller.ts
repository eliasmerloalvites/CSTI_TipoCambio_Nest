import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { IsEmail } from 'class-validator';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @Inject('COMPANY_SERVICE') private clientCompany: ClientProxy
  ) {}


  @Get()
  async findAllUser(){
    return await this.clientCompany
      .send({ cmd: 'find_all_user' }, {})
      .toPromise();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/add')
  async createUser(@Body() createUserDto: CreateUserDto) {
    
    return await this.clientCompany
      .send({ cmd: 'create_user' }, createUserDto)
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




}
