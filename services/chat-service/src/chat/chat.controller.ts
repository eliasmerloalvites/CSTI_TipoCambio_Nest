// src/chat.controller.ts en el chat-service
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './interfaces/create-message.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern({ cmd: 'send_message' })
  async sendMessage(createMessageDto: CreateMessageDto) {
    const message = await this.chatService.create(createMessageDto);
    return message;
  }

  @MessagePattern({ cmd: 'mark_message_asread' })
  async markMessageAsRead(params:any) {
    return await this.chatService.markMessageAsRead(params.messageId,params.userId);
  }

  @MessagePattern({ cmd: 'get_messages' })
  async getMessages(params:any) {
    return this.chatService.findAll(params.page,params.limit,params.id_emisor,params.id_receptor);
  }

  
  @MessagePattern({ cmd: 'get_messages_finduser' })
  async getMessagesFindUser(params:any) {
    return this.chatService.findUser(params.page,params.limit,params.id_emisor);
  }

}
