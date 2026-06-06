import { Description } from 'src/domain/entities/description.entity';
import { ProductName } from 'src/domain/entities/productName.entity';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { UpdateDesDto } from '../dto/updateDes.dto';
import { CreateProductDto } from '../dto/createProduct.dto';
import { PopularProductDto } from '../dto/createPopularProduct.dto';

export interface IProductRepository {
  getAllProduct(): Promise<ProductName[]>;
  getProduct(productId: number): Promise<ProductName | null>;
  getDesById(desId: number): Promise<Description | null>;
  updateDesProduct(
    productId: string,
    updateDesDto: UpdateDesDto,
  ): Promise<Description | null>;
  getDesById(desId: number): Promise<Description | null>;
  getProductBySearch(
    productTitle: string,
    productModel: number,
  ): Promise<ProductName[]>;
  getNewProduct(): Promise<ProductName[]>;
  createProduct(createProductDto: CreateProductDto): Promise<ProductName>;
  deleteNewProduct(code: string | number): Promise<void>;
  deleteCoverProduct(productId: number): Promise<void>;
  deleteNormalProduct(code: string | number): Promise<void>;
  getProductPopular(): Promise<ProductName[]>;
  getMainCover(): Promise<ProductName[]>;
  updateProduct(id: string, dto: any): Promise<ProductName>;
  createPopularProduct(dto: PopularProductDto): Promise<ProductName>;
  createCover(coverData: any): Promise<ProductName>;
  deletePopularProduct(productId: number): Promise<void>;
  createDetailSubDetail(data: any): Promise<void>;
  filterProduct(data: number[]): Promise<void>;
}
