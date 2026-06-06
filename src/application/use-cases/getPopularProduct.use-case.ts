import { Inject, Injectable } from '@nestjs/common';
import { Categories } from '../../domain/entities/categories.entity';
import { ProductName } from '../../domain/entities/productName.entity';
import { SubCategories } from '../../domain/entities/subCategories.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { ICategoryProductRepository } from '../interfaces/IProductCategory.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';

export class GetPopularProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<ProductName[]> {
    return await this.productRepository.getProductPopular();
  }
}
