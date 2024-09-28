// src/chat/chat.gateway.ts en el api-gateway
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Aquí puedes agregar lógica para manejar nuevas conexiones
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    // Aquí puedes agregar lógica para manejar desconexiones
    try {
      console.log(`Client disconnected: ${client.id}`);
      await this.chatService.offlineUser(client.id);
    } catch (error) {
      console.error('Error handling private message:', error.message);
      client.emit('error', 'Error handling private message');
    }
    
  }

  

  //para chat privado
  @SubscribeMessage('joinPrivateChat')
  handleJoinPrivateChat(client: Socket, room: string) {
    console.log(`Client ${client.id} joined room ${room}`);
    client.join(room);
  }
  
  @SubscribeMessage('joinByIdChat')
  handleJoinByIdChat(client: Socket, id_user: string) {
    client.join(id_user);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(client: Socket, { room, id_receptor, message }: { room: string, id_receptor: string, message: MessageDto }) {
    const sendMensaje = await this.chatService.sendMessage(message);
    this.server.to(room).emit('privateMessage', sendMensaje);
    this.server.to(id_receptor).emit('privateMessage', sendMensaje);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, @MessageBody() { messageId, userId }: { messageId: string, userId: string }) {
    await this.chatService.markMessageAsRead(messageId, userId);
  }


  //para salas de grupo
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }


   //para chat privado
   @SubscribeMessage('joinEstatusOnline')
   async handleJoinEstatusOnline(client: Socket, id_user: string) {
      // console.log(`Client ${client.id} joined id_user ${id_user}`);
      await this.chatService.onlineUser(id_user,client.id);
   }

  //message generales
  @SubscribeMessage('message')
  async  handleMessage(@MessageBody() createMessageDto: MessageDto) {
    // Emitir el mensaje a todos los clientes conectados
    await this.chatService.sendMessage(createMessageDto);
    this.server.emit('message', {createMessageDto});
  }
}
