import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Attachments')
export class AttachmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  attachmentId: number;

  @Column({ type: 'nvarchar', length: 50 })
  attachmentType: string;

  @Column({ type: 'nvarchar', length: 100 })
  attachmentName: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  insertDate: Date;

  @Column({ type: 'varchar', nullable: true })
  fileName: string;

  @Column({ type: 'varchar', nullable: true })
  ext: string;
}
