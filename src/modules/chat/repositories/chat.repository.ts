import { EntityRepository, Repository } from 'typeorm';
import { ChatEntity } from '../chat.entity';

@EntityRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {
  async findConversation(
    userId: number,
    recipientId: string,
    limit: number = 50,
  ): Promise<ChatEntity[]> {
    return this.createQueryBuilder('chat')
      .where('(chat.senderId = :userId AND chat.receiverId = :recipientId)')
      .orWhere('(chat.senderId = :recipientId AND chat.receiverId = :userId)')
      .setParameters({ userId, recipientId: String(recipientId) })
      .orderBy('chat.sentAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  // async markMessagesAsRead(
  //   senderId: string,
  //   receiverId: number,
  // ): Promise<void> {
  //   await this.createQueryBuilder()
  //     .update(ChatEntity)
  //     .set({ time: new Date().getTime })
  //     .where(
  //       'senderId = :senderId AND receiverId = :receiverId AND readAt IS NULL',
  //     )
  //     .setParameters({ senderId, receiverId })
  //     .execute();
  // }

  //   async getUnreadCount(receiverId: number): Promise<number> {
  //     return this.chatRepository.count({
  //       where: {
  //         receiverId: receiverId.toString(), // تبدیل number به string
  //         readAt: null,
  //       },
  //     });
  //   }
}
