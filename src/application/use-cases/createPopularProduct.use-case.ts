import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { PopularProductDto } from '../dto/createPopularProduct.dto';

export class CreatePopularProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(postData: PopularProductDto) {
    return await this.productRepository.createPopularProduct(postData);
  }
}
