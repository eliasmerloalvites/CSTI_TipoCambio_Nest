// src/chat.controller.ts en el chat-service
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './create-message.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern({ cmd: 'send_message' })
  async sendMessage(createMessageDto: CreateMessageDto) {
    const message = await this.chatService.create(createMessageDto);
    return message;
  }

  @MessagePattern({ cmd: 'get_messages' })
  async getMessages() {
    return this.chatService.findAll();
  }
}
