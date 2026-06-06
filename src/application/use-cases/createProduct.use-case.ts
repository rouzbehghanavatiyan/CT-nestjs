import { Inject, Injectable } from '@nestjs/common';
import { ProductName } from '../../domain/entities/productName.entity';
import type { IProductRepository } from '../interfaces/IProduct.repository';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { CreateProductDto } from '../dto/createProduct.dto';

export class CreateProductUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PRODUCT)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(createProductDto: CreateProductDto): Promise<ProductName> {
    return await this.productRepository.createProduct(createProductDto);
  }
}
