import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from '../chat/chat.module';
import { PushNotificationService } from '../chat/pushNotification.service';

@Module({
  imports: [ChatModule],
  providers: [ChatGateway, PushNotificationService],
  exports: [ChatGateway],
})
export class SocketModule {}
