import { Injectable, Inject } from '@nestjs/common';
import { Features } from '../../domain/entities/features.entity';
import type { IFeaturesRepository } from '../interfaces/IFeatures.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { CreateFeatureProductDTO } from '../dto/createFeatureProduct.dto';
import { FeatureProductEntity } from 'src/domain/entities/featureProduct.entity';

@Injectable()
export class GetFeaturesFromProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.FEATURES)
    private readonly featuresRepository: IFeaturesRepository,
  ) {}
  
  async execute(productId: number): Promise<FeatureProductEntity[]> {
    return await this.featuresRepository.getFeaturesFromProduct(productId);
  }
}
