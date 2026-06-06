import { Inject } from '@nestjs/common';
import { GetProductCategoryRepository } from '../../infrastructure/repositories/productCategory.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class GetSubCategoriesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CATEGORY_PRODUCT)
    private readonly categoryRepository: GetProductCategoryRepository,
  ) {}

  async excute(categoryId: number) {
    return await this.categoryRepository.getCategoryProductByCategoryId(
      categoryId,
    );
  }
}
