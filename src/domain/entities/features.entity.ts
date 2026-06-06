import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductName } from './productName.entity';

@Entity()
export class Features {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @ManyToOne(() => ProductName, (product) => product.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name:"productId"})
  product: ProductName;
}
