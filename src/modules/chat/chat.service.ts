// src/modules/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  // متدهای مربوط به دریافت پیام‌ها
  async getUserMessageService(
    sender: number,
    recieveId: number,
    skip: number = 0,
    take: number = 20,
  ): Promise<{ messages: ChatEntity[]; hasMore: boolean; total: number }> {
    try {
      const totalQuery = this.chatRepository
        .createQueryBuilder('chat')
        .where('(chat.sender = :sender AND chat.recieveId = :recieveId)')
        .orWhere('(chat.sender = :recieveId AND chat.recieveId = :sender)')
        .setParameters({ sender, recieveId });

      const total = await totalQuery.getCount();

      const messages = await totalQuery
        .orderBy('chat.createdAt', 'DESC')
        .skip(skip)
        .take(take + 1)
        .getMany();
      
      const hasMore = messages.length > take;
      if (hasMore) messages.pop();

      return {
        messages: messages.reverse(),
        hasMore,
        total,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user messages: ${error.message}`);
    }
  }

  async markMessagesAsRead(sender: number, receiver: number) {
    return await this.chatRepository.update(
      { sender: sender, recieveId: receiver, isRead: false },
      { isRead: true },
    );
  }

  async getMessagesByRecieveId(userIdLogin: number): Promise<any[]> {
    const query = `
            select distinct [user].*, attachment.AttachmentName, attachment.[FileName], attachment.AttachmentType, attachment.Ext  From [User] [user]  
            join chat_entity chat on [user].Id=chat.sender
            join Attachments attachment on [user].Id=attachment.AttachmentId
            where chat.recieveId=${userIdLogin}`;
    return await this.chatRepository.query(query, [userIdLogin]);
  }
}