import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Features } from './features.entity';
import { AttachmentEntity } from './attachment.entity';
import { Description } from './description.entity';
import { ProductDetail } from './productDetail.entity';

@Entity('product_names')
export class ProductName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  en_name: string;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ type: 'int', nullable: true })
  categoryId: number;

  @Column({ type: 'int', nullable: true })
  priceProduct: number;

  @Column({ type: 'int', nullable: true })
  subcategoryId: number;

  @Column({ type: 'text', nullable: true })
  position: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  redirect: string;

  @OneToOne(() => Description, (des) => des.content, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  des: Description;

  @OneToMany(() => Features, (feature) => feature.product, {
    nullable: true,
    cascade: true,
  })
  features: Features[];

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.product, {
    eager: true,
    // cascade: true,
    nullable: true,
  })
  attachments: AttachmentEntity[];

  @OneToMany(() => ProductDetail, (pd) => pd.product, {
    cascade: true,
  })
  productDetails: ProductDetail[];
}
