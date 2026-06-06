import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { Description } from 'src/domain/entities/description.entity';

@Injectable()
export class GetDesByIdUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(code: number): Promise<Description> {
    if (!code) {
      throw new Error('Product code is required');
    }
    const product = await this.productRepository.getDesById(code);
    if (!product) {
      throw new NotFoundException(`Product with desId ${code} not found`);
    }
    return product;
  }
}
