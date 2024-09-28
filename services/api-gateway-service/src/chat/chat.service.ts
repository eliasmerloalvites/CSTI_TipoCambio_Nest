// src/chat/chat.service.ts en el api-gateway
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './create-message.dto';

@Injectable()
export class ChatService {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(createMessageDto: CreateMessageDto): Promise<any> {
    return this.client.send({ cmd: 'send_message' }, createMessageDto).toPromise();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<any> {
    return this.client.send({ cmd: 'mark_message_asread' }, {messageId,userId}).toPromise();
  }

  async onlineUser(id_user: String,client: String): Promise<any> {
    return this.client.send({ cmd: 'user_online' }, {id_user,client}).toPromise();
  }

  async offlineUser(client: String): Promise<any> {
    return this.client.send({ cmd: 'user_offline' }, {client}).toPromise();
  }

}
