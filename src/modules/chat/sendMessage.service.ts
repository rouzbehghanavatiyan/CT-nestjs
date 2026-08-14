import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Injectable()
export class SendMessageService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async execute(msgData: any): Promise<ChatEntity> {
    const newMessage = this.chatRepository.create({
      // تبدیل صریح به String برای جلوگیری از خطای دیتابیس (SQL Server)
      senderId: String(msgData.sender), 
      receiveId: String(msgData.recieveId), 
      content: msgData.content,
      createdAt: new Date(),
      isRead: false,
    });

    const response = await this.chatRepository.save(newMessage);
    return response;
  }
}
