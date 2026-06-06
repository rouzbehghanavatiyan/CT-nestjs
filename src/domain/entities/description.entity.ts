import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ProductName } from './productName.entity';

@Entity('description')
export class Description {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @OneToOne(() => ProductName, (product) => product.des, {
    nullable: true,
  })
  Product: ProductName;
}
