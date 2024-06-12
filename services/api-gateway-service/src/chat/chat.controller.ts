// src/chat/chat.controller.ts (en el api-gateway)
import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(@Inject('CHAT_SERVICE') private readonly chatService: ClientProxy) {}

  @Post('send')
  sendMessage(@Body() createMessageDto: { content: string }): Observable<any> {
    console.log("esta llegando al controller - send")
    return this.chatService.send({ cmd: 'send_message' }, createMessageDto);
  }

  @Get('messages')
  getMessages(): Observable<any> {
    console.log("esta llegando al controller - messages")
    return this.chatService.send({ cmd: 'get_messages' }, {});
  }
}
