import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IAccount } from 'src/account/interfaces/account.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    connectedUsers = new Map<string, number>();
    constructor(
        private jwtService: JwtService,
        //private chatRoomService: ChatRoomService
      ) {}

    async handleConnection(@ConnectedSocket() client: Socket) {
        let account: IAccount;
        try {
          account = await this.jwtService.verify(client.handshake.headers.token.toString());
        }
        catch(e) {
          client.emit('message', {"statusCode": 401, "message": "Unauthorized"});
          client.disconnect()
        }
  
        if (account) {
  
          this.connectedUsers.set(client.id, account.id);
  
          //const listRooms = await this.chatRoomService.getListRooms(Number(account.id));
  
          /* Подгружаем историю сообщений
          const history = await this.chatRoomService.getHistoryByRooms(listRooms, 0, 50);
          client.emit('loadHistory', history);
          /* */
  
          /* Отдаем клиенту список комнат
          client.emit('listRooms', this.chatRoomService.getInfoRooms(listRooms));
          /* */
  
          /* Подсоединяем пользователя ко всем его комнатам
          for (const r of listRooms) {
            client.join(r.id.toString());
          }
          /* */
        }
  
    }

    @SubscribeMessage('messages')
    sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; message: string }): void {
        
        if (data.message.length > 455) {
  
        }
        else if (data.message.length < 3) {
            /*
            this.server.to(client.id).emit('exception', {
            'Minimum 3 symbols'
            });
            */
        }
        else {
            this.server.to(data.room).emit('message', { room: data.room, message: data.message });
            //this.chatRoomService.addMessage(this.connectedUsers.get(client.id), Number(data.room), data.message );
        }
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.connectedUsers.delete(client.id)
    }
}
