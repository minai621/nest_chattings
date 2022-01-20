import { Chatting } from './models/chattings.model';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Socket as SocketModel } from './models/socket.model';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>
  ) {}
  afterInit(server: any) {}
  handleConnection(client: any, ...args: any[]) {}
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnected_user', user.username);
      await user.delete();
    }
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({ id: socket.id, username });
    } else {
      await this.socketModel.create({ id: socket.id, username });
    }
    socket.broadcast.emit('user_connected', username);
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket
  ) {
    const socketObj = await this.socketModel.findOne({ od: socket.id });
    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });
    socket.broadcast.emit('new_chat', { chat, username: socketObj.username });
  }
}
