import { Categories } from 'src/domain/entities/categories.entity';
import { ProductName } from 'src/domain/entities/productName.entity';
import { SubCategories } from 'src/domain/entities/subCategories.entity';

export interface ICategoryRepository {
  getAllCategoryList(): Promise<Categories[]>;
  getSubCategoriesBySubcategoryId(categoryId: number): Promise<ProductName[]>;
  getCategoryById(categoryId: number): Promise<SubCategories[]>;
}
