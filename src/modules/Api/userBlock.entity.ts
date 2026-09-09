import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'UserBlocks' })
export class UserBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'BlockerId' })
  blockerId: string;

  @Index()
  @Column({ name: 'BlockedId' })
  blockedId: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}
