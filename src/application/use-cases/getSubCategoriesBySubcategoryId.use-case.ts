import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';

@Injectable()
export class GetSubCategoriesBySubcategoryIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: number) {
    return await this.categoryRepository.getSubCategoriesBySubcategoryId(
      categoryId,
    );
  }
}
