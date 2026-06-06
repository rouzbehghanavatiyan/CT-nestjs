import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductName } from './productName.entity';
import { Details } from './details.entity';
import { SubDetails } from './subDetails.entity';


@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductName, (product) => product.productDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductName;

  @ManyToOne(() => Details, { eager: true })
  @JoinColumn({ name: 'detailId' })
  detail: Details;

  @ManyToOne(() => SubDetails, { eager: true })
  @JoinColumn({ name: 'subDetailId' })
  subDetail: SubDetails;
}