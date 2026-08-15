import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export interface ChatMessageContent {
  type: 'text' | 'image' | 'audio' | 'video' | 'system';
  text?: string;
}

@Entity('chats')
@Index(['senderId', 'receiveId'])
@Index(['createdAt'])
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  senderId: string;

  @Column({ type: 'varchar', length: 36 })
  receiveId: string;

  @Column({ type: 'simple-json' })
  content: ChatMessageContent;

  @Column({ type: 'bit', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
