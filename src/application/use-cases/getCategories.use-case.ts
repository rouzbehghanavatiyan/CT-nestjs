import { Categories } from '../../domain/entities/categories.entity';
import { ICategoryRepository } from '../interfaces/ICategory.repository';

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async excuted(): Promise<Categories[]> {
    return await this.categoryRepository.getAllCategoryList();
  }
}