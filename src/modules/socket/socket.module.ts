import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule], 
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class SocketModule {}