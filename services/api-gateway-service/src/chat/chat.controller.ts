// src/chat/chat.controller.ts (en el api-gateway)
import { Controller, Post, Body, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(@Inject('CHAT_SERVICE') private readonly chatService: ClientProxy) {}

  @Get()
  async getMessages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('id_emisor') id_emisor: string,
    @Query('id_receptor') id_receptor: string,
  ) {
    const params = {
      page,
      limit,
      id_emisor,
      id_receptor,
    }
    return this.chatService.send({ cmd: 'get_messages' }, params).toPromise();
  }

  @Get('/messagesfinduser')
  async getMessagesFindUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('id_emisor') id_emisor: string
  ) {
    const params = {
      page,
      limit,
      id_emisor
    }
    return this.chatService.send({ cmd: 'get_messages_finduser' }, params).toPromise();
  }

}
