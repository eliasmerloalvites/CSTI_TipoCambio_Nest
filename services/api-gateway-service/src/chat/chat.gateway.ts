// src/chat/chat.gateway.ts en el api-gateway
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async  handleMessage(@MessageBody() createMessageDto: { content: string }) {
    // Emitir el mensaje a todos los clientes conectados
    await this.chatService.sendMessage(createMessageDto);
    this.server.emit('message', {createMessageDto});
  }
}
