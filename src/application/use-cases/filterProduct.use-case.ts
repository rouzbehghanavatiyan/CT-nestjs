import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IProductRepository } from '../interfaces/IProduct.repository';

@Injectable()
export class FilterProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(data: any) {
    return await this.productRepo.filterProduct(data);
  }
}
