import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { Description } from 'src/domain/entities/description.entity';
import { UpdateProductDto } from '../dto/updateProduct.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}
  async execute(productId: string, dto: any): Promise<ProductName> {
    return await this.productRepository.updateProduct(productId, dto);
  }
}
