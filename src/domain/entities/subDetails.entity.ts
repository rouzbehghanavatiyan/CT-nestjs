import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Details } from './details.entity';

@Entity()
export class SubDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ManyToOne(() => Details, (detail) => detail.subDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'detailId' })
  detailId: Details;
}
