import { Inject, Injectable } from '@nestjs/common';
import type { IMainProductRepository } from '../interfaces/IMainProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IProductRepository } from '../interfaces/IProduct.repository';

@Injectable()
export class CreateCoverUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly mainProductRepository: IProductRepository,
  ) {}

  async execute(coverData:any) {
    return await this.mainProductRepository.createCover(coverData);
  }
}
