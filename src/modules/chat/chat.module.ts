import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'src/modules/chat/chat.controller';
import { ChatEntity } from 'src/modules/chat/chat.entity';
import { ChatService } from 'src/modules/chat/chat.service';
import { SendMessageService } from 'src/modules/chat/sendMessage.service';
import { PushNotificationService } from './pushNotification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity]), JwtModule],
  controllers: [ChatController],
  providers: [ChatService, SendMessageService, PushNotificationService],
  exports: [ChatService, SendMessageService, PushNotificationService],
})
export class ChatModule {}
