import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'src/modules/chat/chat.controller';
import { ChatEntity } from 'src/modules/chat/chat.entity';
import { ChatService } from 'src/modules/chat/chat.service';
import { SendMessageService } from 'src/modules/chat/sendMessage.service';
import { JwtModule } from '@nestjs/jwt';
import { BotReplyJobEntity } from './botReplyJob.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, BotReplyJobEntity]),
    JwtModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, SendMessageService],
  exports: [ChatService, SendMessageService],
})
export class ChatModule {}
