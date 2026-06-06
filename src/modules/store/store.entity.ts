import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoDraftEntity } from '../File/VideoDraftEntity';

@Entity()
export class StoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column('nvarchar', { nullable: true })
  name: string | null;

  @Column('int', { nullable: true })
  price: number | null;

  @OneToMany(() => VideoDraftEntity, (draft) => draft.product)
  videoDrafts: VideoDraftEntity[];

  @Column('nvarchar', { nullable: true })
  des: string | null;
}
