import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from '../chat/chat.module';
import { PushNotificationService } from '../chat/pushNotification.service';
import { GapGptService } from '../chat/gapgpt.service';
import { BotReplyScheduler } from './botReply.scheduler';
import { BotReplyJobEntity } from '../chat/botReplyJob.entity';

@Module({
  imports: [ChatModule, TypeOrmModule.forFeature([BotReplyJobEntity])],
  providers: [
    ChatGateway,
    PushNotificationService,
    GapGptService,
    BotReplyScheduler,
  ],
  exports: [ChatGateway],
})
export class SocketModule {}
