import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bot_reply_jobs')
export class BotReplyJobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  botId: string;

  @Index()
  @Column({ type: 'datetime2' })
  runAt: Date;

  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'processing';

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @CreateDateColumn({ type: 'datetime2', default: () => 'SYSUTCDATETIME()' })
  createdAt: Date;
}
