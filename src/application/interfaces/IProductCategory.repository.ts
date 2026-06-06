import { SubCategories } from "src/domain/entities/subCategories.entity";

export interface ICategoryProductRepository {
  getCategoryProductByCategoryId(code:  number): Promise<SubCategories[]>;
}
