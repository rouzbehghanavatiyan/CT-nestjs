import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';

@Entity()
export class SubCategories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;
  
  @Column()
  categoryId: number;

  @ManyToOne(() => Categories, (category) => category.subCategory)
  category: Categories;
}
