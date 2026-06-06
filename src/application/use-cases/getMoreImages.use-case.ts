import { Inject } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IAddtionalRepository } from '../interfaces/IAddtional.repository';

export class GetMoreImagesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ADDTIONAL)
    private readonly addtionalRepo: IAddtionalRepository,
  ) {}

  async execute(): Promise<void> {
    return await this.addtionalRepo.getMoreImages();
  }
}
