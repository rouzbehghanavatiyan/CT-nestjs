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

  async getMessagesByReceiveId(userIdLogin: string): Promise<any[]> {
    const query = `
    SELECT 
      u.*,
      att.AttachmentName,
      att.[FileName],
      att.AttachmentType,
      att.Ext,
      (SELECT COUNT(*) FROM chats c WHERE c.senderId = u.Id AND c.receiveId = @0 AND c.isRead = 0) AS unreadCount,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM chats c 
          WHERE c.senderId = u.Id AND c.receiveId = @0 AND c.isRead = 0
        ) THEN CAST(0 AS BIT) 
        ELSE CAST(1 AS BIT) 
      END AS isReadChat
    FROM (
      SELECT DISTINCT
        CASE WHEN chat.senderId = @0 THEN chat.receiveId ELSE chat.senderId END AS PartnerId
      FROM chats chat
      WHERE chat.senderId = @0 OR chat.receiveId = @0
    ) partners
    JOIN [User] u ON u.Id = partners.PartnerId
    OUTER APPLY (
      SELECT TOP 1 a.AttachmentName, a.[FileName], a.AttachmentType, a.Ext
      FROM Attachments a
      WHERE a.AttachmentId = u.Id
      ORDER BY a.Id DESC
    ) att`;
    return await this.chatRepository.query(query, [userIdLogin]);
  }

  async markMessagesAsRead(
    senderId: string,
    receiveId: string,
    messageId?: number,
  ) {
    try {
      if (messageId) {
        return await this.chatRepository.update(
          { id: messageId, receiveId: receiveId, isRead: false },
          { isRead: true },
        );
      }

      return await this.chatRepository.update(
        { senderId: senderId, receiveId: receiveId, isRead: false },
        { isRead: true },
      );
    } catch (error: any) {
      throw new Error(`Failed to update read status: ${error.message}`);
    }
  }

  async getUnreadMessagesCount(userId: string): Promise<{ count: number }> {
    const count = await this.chatRepository.count({
      where: {
        receiveId: userId,
        isRead: false,
      },
    });
    return { count };
  }
}
