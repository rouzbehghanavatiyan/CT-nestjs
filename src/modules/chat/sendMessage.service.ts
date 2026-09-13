import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity, ChatMessageContent } from './chat.entity';

@Injectable()
export class SendMessageService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async execute(msgData: any): Promise<ChatEntity> {
    const senderId = String(msgData?.sender ?? '').trim();
    const receiveId = String(msgData?.recieveId ?? '').trim();
    const text = String(msgData?.content ?? '').trim();

    if (!senderId || !receiveId || !text) {
      throw new BadRequestException('sender, recieveId و content الزامی هستند');
    }

    const blockQuery = `
      SELECT TOP 1 [Id]
      FROM [sotDb].[dbo].[UserBlock]
      WHERE (BlockerId = @0 AND BlockedId = @1)
         OR (BlockerId = @1 AND BlockedId = @0)`;

    const blockResult = await this.chatRepository.query(blockQuery, [
      receiveId,
      senderId,
    ]);

    if (blockResult && blockResult.length > 0) {
      throw new ForbiddenException(
        'امکان ارسال پیام به دلیل مسدود بودن وجود ندارد.',
      );
    }

    const content: ChatMessageContent = {
      type: 'text',
      text,
    };

    const newMessage = this.chatRepository.create({
      senderId,
      receiveId,
      content,
      isRead: false,
    });

    return this.chatRepository.save(newMessage);
  }
}
