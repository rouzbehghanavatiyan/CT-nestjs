import { SubCategories } from 'src/domain/entities/subCategories.entity';

export interface ISubCategoryRepository {
  getAllSubCategoryListByCategoryId(categoryId:number | string): Promise<SubCategories[]>;
}
