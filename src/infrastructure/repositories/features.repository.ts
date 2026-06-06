import { InjectRepository } from '@nestjs/typeorm';
import { Features } from '../../domain/entities/features.entity';
import { Repository } from 'typeorm';
import { IFeaturesRepository } from 'src/application/interfaces/IFeatures.repository';
import { CreateFeatureProductDTO } from 'src/application/dto/createFeatureProduct.dto';
import { FeatureProductEntity } from 'src/domain/entities/featureProduct.entity';

export class FeatureRepository implements IFeaturesRepository {
  constructor(
    @InjectRepository(Features)
    private readonly featureRepository: Repository<Features>,

    @InjectRepository(FeatureProductEntity)
    private readonly featureProductRepository: Repository<FeatureProductEntity>,
  ) {}

  async createFeature(feature: Features): Promise<Features> {
    const newFeature = this.featureRepository.create(feature);
    return await this.featureRepository.save(newFeature);
  }

  async getAllFeature(): Promise<Features[]> {
    const result = this.featureRepository.find();
    return result;
  }

  async createFeatureProduct(
    dto: CreateFeatureProductDTO,
  ): Promise<FeatureProductEntity> {
    const { productId, featureId } = dto;
    if (featureId && featureId.length > 0) {
      const featureProducts = featureId.map((id: number) =>
        this.featureProductRepository.create({
          productId: productId,
          featureId: id,
        }),
      );

      const savedProducts =
        await this.featureProductRepository.save(featureProducts);
      return savedProducts[0];
    }

    throw new Error('No feature IDs provided');
  }

  async getFeaturesFromProduct(code: number | string): Promise<any[]> {
    const result = await this.featureProductRepository.query(
      `
    SELECT fp."productId", fe.title, pn."name" 
FROM feature_product fp 
JOIN product_names pn ON fp."productId" = pn.id 
JOIN features fe ON fe.id = fp."featureId" 
WHERE pn.id = $1
UNION
SELECT pn.id as "productId", fe.title, pn."name" 
FROM product_names pn 
JOIN features fe ON fe."productId" = pn.id 
WHERE pn.id = $1;
`,
      [code],
    );
    console.log('resultresultresultresultresult', result);

    return result;
  }
}
