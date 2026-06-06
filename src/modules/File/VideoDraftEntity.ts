import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoreEntity } from '../store/store.entity';

export type VideoDraftStatus =
  | 'CREATED'
  | 'UPLOADING'
  | 'COMPLETED'
  | 'DELETED';

@Entity('video_drafts')
export class VideoDraftEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ---------- Relation ----------
  @Column({ nullable: true })
  productId?: string;

  @ManyToOne(() => StoreEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'productId' })
  product?: StoreEntity;

  // ---------- Draft Status ----------
  @Column({
    type: 'varchar',
    length: 20,
    default: 'CREATED',
  })
  status: VideoDraftStatus;

  // ---------- File Info ----------
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  filename?: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  contentType?: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  size?: string;

  // ---------- Upload Session ----------
  @Index()
  @Column({
    nullable: true,
  })
  uploadId?: string;

  // MSSQL jsonb ندارد
  @Column({
    type: 'nvarchar',
    nullable: true,
  })
  metadata?: string;

  // ---------- Final Video URL ----------
  @Index()
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  finalUrl?: string;

  // ---------- Dates ----------
  @CreateDateColumn({
    type: 'datetime2',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime2',
  })
  updatedAt: Date;

  @BeforeUpdate()
  beforeUpdate() {}
}
