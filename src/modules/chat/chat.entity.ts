import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column('nvarchar', { nullable: true })
  title: string | null;

  @Column('int', { nullable: true })
  recieveId: number | null;

  @Column('int', { nullable: true, default: 0 })
  sender: number | null;

  @Column({ type: 'varchar', nullable: true })
  time: string;

  @Column({ type: 'bit', default: false })
  isRead: boolean;

  @Column({ type: 'text', nullable: true })
  userProfile: string | null;

  @Column({ type: 'text', nullable: true })
  userNameSender: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
