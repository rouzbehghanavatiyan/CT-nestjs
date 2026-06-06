import { Categories } from '../../domain/entities/categories.entity';
import { ProductName } from '../../domain/entities/productName.entity';
import { SubCategories } from '../../domain/entities/subCategories.entity';
import { ICategoryProductRepository } from '../interfaces/IProductCategory.repository';

export class GetProductCategoryUseCase {
  constructor(
    private readonly productCategoryRepository: ICategoryProductRepository,
  ) {}

  async excute(code: number): Promise<SubCategories[]> {
    return await this.productCategoryRepository.getCategoryProductByCategoryId(
      code,
    );
  }
}
