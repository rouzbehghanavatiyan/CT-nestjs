import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategories } from '../../domain/entities/subCategories.entity';
import { ICategoryProductRepository } from 'src/application/interfaces/IProductCategory.repository';

export class GetProductCategoryRepository
  implements ICategoryProductRepository
{
  constructor(
    @InjectRepository(SubCategories)
    private readonly subCategoriesRepository: Repository<SubCategories>, 
  ) {}

  async getCategoryProductByCategoryId(categoryId: number): Promise<SubCategories[]> {
    return await this.subCategoriesRepository.find({
      where: { categoryId: categoryId },
    });
  }
}