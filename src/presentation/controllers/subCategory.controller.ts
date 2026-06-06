import { Controller, Get, Param } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { GetAllSubCategoriesUseCase } from 'src/application/use-cases/getAllSubCategories.use-case';

@Controller('api/subCategory')
export class SubCategoryController {
  constructor(
    private readonly getAllSubCategoriesUseCase: GetAllSubCategoriesUseCase,
  ) {}

  @Get('getAllSubCategories/:categoryId')
  async getAllSubCategoriesController(
    @Param('categoryId') categoryId: string | number,
  ) {
    return await this.getAllSubCategoriesUseCase.excuted(categoryId);
  }
}
