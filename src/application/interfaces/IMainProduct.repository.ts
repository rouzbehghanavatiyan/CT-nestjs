import { ProductName } from "src/domain/entities/productName.entity";

export interface IMainProductRepository {
  getMainCover(): Promise<ProductName[]>;
}
