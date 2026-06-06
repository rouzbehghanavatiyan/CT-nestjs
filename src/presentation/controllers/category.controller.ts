import {
  Controller,
  Get,
  HttpException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { join } from 'path';
import { GetCategoriesUseCase } from 'src/application/use-cases/getCategories.use-case';
import { CategoryRepository } from 'src/infrastructure/repositories/category.repository';
import { GetProductCategoryUseCase } from 'src/application/use-cases/getProductCategory-use-case';
import { GetSubCategoriesUseCase } from 'src/application/use-cases/getSubCategories.use-case';
import { GetSubCategoriesBySubcategoryIdUseCase } from 'src/application/use-cases/getSubCategoriesBySubcategoryId.use-case';
import { GetCategoryByIdUseCase } from 'src/application/use-cases/getSubCategoryById.use-case';

@Controller('api/category')
export class CategoryController {
  private readonly getCategoriesUseCase: GetCategoriesUseCase;
  constructor(
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly categoryRepository: CategoryRepository,
    private readonly getProductCategoryUseCase: GetProductCategoryUseCase,
    private readonly getSubCategoriesUseCase: GetSubCategoriesUseCase,
    private readonly getSubCategoriesBySubcategoryId: GetSubCategoriesBySubcategoryIdUseCase,
  ) {
    this.getCategoriesUseCase = new GetCategoriesUseCase(
      this.categoryRepository,
    );
  }

  @Get('getAllCategories')
  async getCategories() {
    return await this.getCategoriesUseCase.excuted();
  }

  @Get('category/:categoryId')
  async getProductCategories(@Query('categoryId') categoryId: number) {
    return await this.getProductCategoryUseCase.excute(categoryId);
  }

  // http://192.168.1.189:4000/category/11/subcategories
  @Get(':categoryId/subcategories')
  async getSubCategoriesByList(@Param('categoryId') categoryId: number) {
    return await this.getSubCategoriesUseCase.excute(categoryId);
  }

  @Get('image/:imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', '..', 'assets/images', imageName);
    console.log(imagePath);
    return imagePath;
  }

  @Get('categoryId=:categoryId')
  async getCategoryById(@Param('categoryId') categoryId: number) {
    return await this.getCategoryByIdUseCase.excute(categoryId);
  }

  @Get('subCategoryId=:subCategoryId')
  async getSubCategoryById(@Param('subCategoryId') categoryId: number) {
    return await this.getSubCategoriesBySubcategoryId.execute(categoryId);
  }
}
