import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: number): Promise<ProductName> {
    if (!productId) {
      throw new Error('Product productId is required');
    }
    const product = await this.productRepository.getProduct(productId);

    if (!product) {
      throw new NotFoundException(
        `Product with productId ${productId} not found`,
      );
    }
    return product;
  }
}
