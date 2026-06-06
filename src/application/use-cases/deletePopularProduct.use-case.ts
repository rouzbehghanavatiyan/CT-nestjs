import { Inject } from '@nestjs/common';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class DeletePopularProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: number): Promise<void> {
    return await this.productRepository.deletePopularProduct(productId);
  }
}
