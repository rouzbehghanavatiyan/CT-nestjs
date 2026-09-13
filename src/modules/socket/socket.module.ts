import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from '../chat/chat.module';
import { PushNotificationService } from '../chat/pushNotification.service';
import { GapGptService } from '../chat/gapgpt.service';

@Module({
  imports: [ChatModule],
  providers: [ChatGateway, PushNotificationService, GapGptService],
  exports: [ChatGateway],
})
export class SocketModule {}
