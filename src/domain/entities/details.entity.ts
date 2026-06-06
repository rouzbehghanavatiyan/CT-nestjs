import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubDetails } from './subDetails.entity';

@Entity()
export class Details {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @OneToMany(() => SubDetails, (subDetail) => subDetail.detailId)
  subDetails: SubDetails[];
}
