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

  async getUserMessageService(
    senderId: string,
    receiveId: string,
    skip: number = 0,
    take: number = 20,
  ): Promise<{ messages: ChatEntity[]; hasMore: boolean; total: number }> {
    try {
      const totalQuery = this.chatRepository
        .createQueryBuilder('chat')
        .where('(chat.senderId = :senderId AND chat.receiveId = :receiveId)')
        .orWhere('(chat.senderId = :receiveId AND chat.receiveId = :senderId)')
        .setParameters({ senderId, receiveId });

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
    } catch (error: any) {
      throw new Error(`Failed to fetch user messages: ${error.message}`);
    }
  }

  async markMessagesAsRead(senderId: string, receiveId: string) {
    return await this.chatRepository.update(
      { senderId: senderId, receiveId: receiveId, isRead: false },
      { isRead: true },
    );
  }

  async getMessagesByReceiveId(userIdLogin: string): Promise<any[]> {
    const query = `
      SELECT DISTINCT 
        [user].*, 
        attachment.AttachmentName, 
        attachment.[FileName], 
        attachment.AttachmentType, 
        attachment.Ext,
        (SELECT COUNT(*) FROM chats c WHERE c.senderId = [user].Id AND c.receiveId = @0 AND c.isRead = 0) AS unreadCount
      FROM [User] [user]  
      JOIN chats chat ON [user].Id = chat.senderId
      JOIN Attachments attachment ON [user].Id = attachment.AttachmentId
      WHERE chat.receiveId = @0`;

    return await this.chatRepository.query(query, [userIdLogin]);
  }
}
