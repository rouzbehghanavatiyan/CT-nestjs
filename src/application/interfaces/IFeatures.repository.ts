import { Features } from 'src/domain/entities/features.entity';
import { CreateFeatureProductDTO } from '../dto/createFeatureProduct.dto';
import { FeatureProductEntity } from 'src/domain/entities/featureProduct.entity';

export interface IFeaturesRepository {
  createFeature(feature: Features): Promise<Features>;
  getAllFeature(): Promise<Features[]>;
  createFeatureProduct(
    dto: CreateFeatureProductDTO,
  ): Promise<FeatureProductEntity>;
  getFeaturesFromProduct(productId: number): Promise<FeatureProductEntity[]>;
}
