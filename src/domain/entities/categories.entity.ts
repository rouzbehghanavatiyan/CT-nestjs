import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubCategories } from './subCategories.entity';
import { AttachmentEntity } from './attachment.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title_per: string;

  @Column({ type: 'varchar', length: 100 })
  title_eng: string;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.category)
  subCategory: SubCategories[];

  @Column({ type: 'int', nullable: true })
  attachId?: number;

  // @OneToOne(() => AttachmentEntity, (attachment) => attachment.category, {
  //   cascade: true,
  // })
  // attachment: AttachmentEntity;
}
