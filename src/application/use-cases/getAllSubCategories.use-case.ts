import { SubCategories } from 'src/domain/entities/subCategories.entity';
import type { ISubCategoryRepository } from '../interfaces/ISubCategory.repository';
import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class GetAllSubCategoriesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.SUB_CATEGORY_PRODUCT)
    private readonly subCategoryRepository: ISubCategoryRepository,
  ) {}

  async excuted(categoryId: string | number): Promise<SubCategories[]> {
    return await this.subCategoryRepository.getAllSubCategoryListByCategoryId(
      categoryId,
    );
  }
}
