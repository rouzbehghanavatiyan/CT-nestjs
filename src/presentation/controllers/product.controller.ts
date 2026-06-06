import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PopularProductDto } from 'src/application/dto/createPopularProduct.dto';
import { CreateProductDto } from 'src/application/dto/createProduct.dto';
import { UpdateDesDto } from 'src/application/dto/updateDes.dto';
import { UpdateProductDto } from 'src/application/dto/updateProduct.dto';
import { CreateCoverUseCase } from 'src/application/use-cases/createCover.use-case';
import { CreateDetailSubDetailUseCase } from 'src/application/use-cases/createDetailSubDetail.use-case';
import { CreatePopularProductUseCase } from 'src/application/use-cases/createPopularProduct.use-case';
import { CreateProductUseCase } from 'src/application/use-cases/createProduct.use-case';
import { DeleteCoverProductUseCase } from 'src/application/use-cases/deleteCoverProduct.use-case';
import { DeleteNewProductUseCase } from 'src/application/use-cases/deleteNewProduct.use-case';
import { DeleteNormalProductUseCase } from 'src/application/use-cases/deleteNormalProduct.use-case';
import { DeletePopularProductUseCase } from 'src/application/use-cases/deletePopularProduct.use-case';
import { FilterProductUseCase } from 'src/application/use-cases/filterProduct.use-case';
import { GetAllProductUseCase } from 'src/application/use-cases/getAllProduct.use-case';
import { GetDesByIdUseCase } from 'src/application/use-cases/getDesById.use-case';
import { GetMainCoverUseCase } from 'src/application/use-cases/getMainCover.use-case';
import { GetNewProductUseCase } from 'src/application/use-cases/getNewProduct.use-case';
import { GetPopularProductUseCase } from 'src/application/use-cases/getPopularProduct.use-case';
import { GetProductUseCase } from 'src/application/use-cases/getProduct.use-case';
import { GetProductBySearchUseCase } from 'src/application/use-cases/getProductBySearch.use-case';
import { UpdateDesUseCase } from 'src/application/use-cases/updateDesProduct.use-case';
import { UpdateProductUseCase } from 'src/application/use-cases/updateProduct.use-case';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly updateDesUseCase: UpdateDesUseCase,
    private readonly getDesByIdUseCase: GetDesByIdUseCase,
    private readonly getProductBySearchUseCase: GetProductBySearchUseCase,
    private readonly getNewProductUseCase: GetNewProductUseCase,
    private readonly getPopularProductUseCase: GetPopularProductUseCase,
    private readonly createPopularProductUseCase: CreatePopularProductUseCase,
    private readonly getMainCoverUseCase: GetMainCoverUseCase,
    private readonly createCoverUseCase: CreateCoverUseCase,
    private readonly deleteNewProductUseCase: DeleteNewProductUseCase,
    private readonly deleteNormalProductUseCase: DeleteNormalProductUseCase,
    private readonly deleteCoverProductUseCase: DeleteCoverProductUseCase,
    private readonly deletePopularProductUseCase: DeletePopularProductUseCase,
    private readonly createDetailSubDetailUseCase: CreateDetailSubDetailUseCase,
    private readonly filterProductUseCase: FilterProductUseCase,
  ) {}

  @Get('getAllProduct')
  async getAllProductController() {
    return await this.getAllProductUseCase.execute();
  }

  @Patch('updateProduct/:productId')
  async updateProductController(
    @Param('productId') productId: string,
    @Body() dto: any,
  ) {
    return await this.updateProductUseCase.execute(productId, dto);
  }

  @Post('createProduct')
  async createProductController(@Body() dto: CreateProductDto) {
    return await this.createProductUseCase.execute(dto);
  }

  @Patch('updateDes/:productId')
  async updateDesController(
    @Param('productId') productId: string,
    @Body() dto: UpdateDesDto,
  ) {
    return await this.updateDesUseCase.execute(productId, dto);
  }

  @Get('getProduct/:productId')
  async getProductByCode(@Param('productId') productId: number) {
    return await this.getProductUseCase.execute(productId);
  }

  @Get('getDesById/:code')
  async getDesByIdController(@Param('code') code: number) {
    return await this.getDesByIdUseCase.execute(code);
  }

  @Get('productBySearching/:productTitle/productModel/:productModel')
  async productBySearching(
    @Param('productTitle') productTitle: string,
    @Param('productModel') productModel: number,
  ) {
    return await this.getProductBySearchUseCase.execute(
      productTitle,
      productModel,
    );
  }

  @Get('new')
  async newProductController() {
    return await this.getNewProductUseCase.execute();
  }

  @Delete('deleteNewProduct/:code')
  async deleteProduct(@Param('code') code: string) {
    return await this.deleteNewProductUseCase.execute(code);
  }

  @Delete('deleteNormalProduct/:code')
  async deleteNormalProductController(@Param('code') code: string) {
    return await this.deleteNormalProductUseCase.execute(code);
  }

  @Delete('deletePopularProduct/:productId')
  async deletePopularProductController(@Param('productId') productId: number) {
    return await this.deletePopularProductUseCase.execute(productId);
  }

  @Delete('deleteCoverProduct/:productId')
  async deleteCoverProduct(@Param('productId') productId: number) {
    return await this.deleteCoverProductUseCase.execute(productId);
  }

  @Get('popular')
  async getPopularProductController() {
    return await this.getPopularProductUseCase.execute();
  }

  @Post('createPopularProduct')
  async createPopularProductController(@Body() postData: PopularProductDto) {
    return await this.createPopularProductUseCase.execute(postData);
  }

  @Get('cover')
  async getMainCover() {
    return await this.getMainCoverUseCase.execute();
  }

  @Post('createCover')
  async createCoverProductController(@Body() createCover: any) {
    return await this.createCoverUseCase.execute(createCover);
  }

  @Post('createDetailSubDetail')
  async createDetailSubDetailController(@Body() data: any) {
    return await this.createDetailSubDetailUseCase.execute(data);
  }

  @Post('filterProduct')
  async filterProductController(@Body() data: any) {
    return await this.filterProductUseCase.execute(data);
  }
}
