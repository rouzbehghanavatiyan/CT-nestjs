import { Inject } from '@nestjs/common';
import { GetProductCategoryRepository } from '../../infrastructure/repositories/productCategory.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { CategoryRepository } from 'src/infrastructure/repositories/category.repository';

export class GetCategoryByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CATEGORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async excute(categoryId: number) {
    return await this.categoryRepository.getCategoryById(categoryId);
  }
}
