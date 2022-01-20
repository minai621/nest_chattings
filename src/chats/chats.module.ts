import { Chatting, ChattingSchema } from './models/chattings.model';
import { Socket, SocketSchema } from './models/socket.model';
import { ChatsGateway } from './chats.gateway';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: Socket.name, schema: SocketSchema },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
