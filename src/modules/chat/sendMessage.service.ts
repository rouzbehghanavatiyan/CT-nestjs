import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity, ChatMessageContent } from './chat.entity';
import { UserBlock } from '../Api/userBlock.entity';

@Injectable()
export class SendMessageService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(UserBlock)
    private readonly blockRepository: Repository<UserBlock>,
  ) {}

  async execute(msgData: any): Promise<ChatEntity> {
    const senderId = String(msgData?.sender ?? '').trim();
    const receiveId = String(msgData?.recieveId ?? '').trim();
    const text = String(msgData?.content ?? '').trim();

    if (!senderId || !receiveId || !text) {
      throw new BadRequestException('sender, recieveId و content الزامی هستند');
    }

    const isBlocked = await this.blockRepository.findOne({
      where: [
        { blockerId: receiveId, blockedId: senderId }, // گیرنده، فرستنده را بلاک کرده
        { blockerId: senderId, blockedId: receiveId }, // فرستنده، گیرنده را بلاک کرده
      ],
    });

    if (isBlocked) {
      throw new ForbiddenException('امکان ارسال پیام به دلیل مسدود بودن وجود ندارد.');
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
