import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateFeatureDTO } from 'src/application/dto/createFeature.dto';
import { CreateFeatureProductDTO } from 'src/application/dto/createFeatureProduct.dto';
import { CreateFeatureProductUseCase } from 'src/application/use-cases/createFeatureProduct.use-case';
import { CreateFeatureUseCase } from 'src/application/use-cases/createFeatures.use-case';
import { GetAllFeatureUseCase } from 'src/application/use-cases/getAllFeature.use-case';
import { GetFeaturesFromProductUseCase } from 'src/application/use-cases/getFeaturesFromProduct.use-case';

@Controller('api/feature')
export class FeatureController {
  constructor(
    private readonly createFeatures: CreateFeatureUseCase,
    private readonly getFeatures: GetAllFeatureUseCase,
    private readonly createFeatureProductUseCase: CreateFeatureProductUseCase,
    private readonly getFeaturesFromProductUseCase: GetFeaturesFromProductUseCase,
  ) {}

  @Post('createFeature')
  async createFeatureController(@Body() createFeatureDTO: CreateFeatureDTO) {
    return await this.createFeatures.execute(createFeatureDTO);
  }

  @Get('getAllFeatures')
  async getAllFeatureController() {
    return await this.getFeatures.execute();
  }

  @Post('createFeatureProduct')
  async createFeatureProductController(@Body() dto: CreateFeatureProductDTO) {
    return await this.createFeatureProductUseCase.execute(dto);
  }

  @Get('getFeaturesFromProduct/:productId')
  async getFeaturesFromProductController(
    @Param('productId') productId: number,
  ) {
    return await this.getFeaturesFromProductUseCase.execute(productId);
  }
}
