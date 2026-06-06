import { Controller, Get } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { GetMoreImagesUseCase } from 'src/application/use-cases/getMoreImages.use-case';

@Controller('api/addtional')
export class AddtionallController {
  constructor(private readonly getMoreImagesUseCase: GetMoreImagesUseCase) {}

  @Get('getMoreImages')
  async getMoreImagesController() {
    return await this.getMoreImagesUseCase.execute();
  }
}
