import { Inject, Injectable } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class GetProductBySearchUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productBySearchRepository: IProductRepository,
  ) {}

  async execute(productTitle: string, productModel: number): Promise<ProductName[]> {
    return await this.productBySearchRepository.getProductBySearch(
      productTitle,
      productModel,
    );
  }
}
