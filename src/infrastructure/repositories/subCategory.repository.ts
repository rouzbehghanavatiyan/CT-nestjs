import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubCategoryRepository } from 'src/application/interfaces/ISubCategory.repository';
import { SubCategories } from 'src/domain/entities/subCategories.entity';

@Injectable()
export class SubCategoryRepository implements ISubCategoryRepository {
  constructor(
    @InjectRepository(SubCategories)
    private readonly subCategory: Repository<SubCategories>,
  ) {}
  async getAllSubCategoryListByCategoryId(
    categoryId: number | string,
  ): Promise<SubCategories[]> {
    const fixCategoryId = Number(categoryId);
    const subCategories = await this.subCategory.find({
      where: { categoryId: fixCategoryId },
    });
    return subCategories;
  }
}
