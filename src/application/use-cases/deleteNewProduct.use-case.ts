import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IProductRepository } from '../interfaces/IProduct.repository';

export class DeleteNewProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(code: number | string): Promise<void> {
    return await this.productRepository.deleteNewProduct(code);
  }
}
