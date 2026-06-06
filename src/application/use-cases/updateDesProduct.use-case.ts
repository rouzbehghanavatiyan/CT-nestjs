import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { Description } from 'src/domain/entities/description.entity';
import { UpdateDesDto } from '../dto/updateDes.dto';

@Injectable()
export class UpdateDesUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(
    productId: string,
    dto: UpdateDesDto,
  ): Promise<Description | null> {
    return await this.productRepository.updateDesProduct(productId, dto);
  }
}
