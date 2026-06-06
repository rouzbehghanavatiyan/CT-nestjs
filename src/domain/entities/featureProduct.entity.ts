import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feature_product')
export class FeatureProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  featureId: number;

  @Column()
  productId: number;
}
