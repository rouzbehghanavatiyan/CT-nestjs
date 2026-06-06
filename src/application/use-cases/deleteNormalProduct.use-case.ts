import { Inject } from '@nestjs/common';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class DeleteNormalProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(code: number | string): Promise<void> {
    return await this.productRepository.deleteNormalProduct(code);
  }
}
