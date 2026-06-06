import { Injectable, Inject } from '@nestjs/common';
import { Features } from '../../domain/entities/features.entity';
import { CreateFeatureDTO } from '../dto/createFeature.dto';
import type { IFeaturesRepository } from '../interfaces/IFeatures.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

@Injectable()
export class CreateFeatureUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.FEATURES)
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async execute(createFeatureDTO: CreateFeatureDTO): Promise<Features> {
    const feature = new Features();
    feature.title = createFeatureDTO.title;
    return await this.featuresRepository.createFeature(feature);
  }
}
