import { Inject } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IProductRepository } from '../interfaces/IProduct.repository';

export class GetNewProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly newProductRepository: IProductRepository,
  ) {}

  async execute(): Promise<ProductName[]> {
    return await this.newProductRepository.getNewProduct();
  }
}
