import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateDetailDTO } from 'src/application/dto/createDetail.dto';
import { CreateDetailUseCase } from 'src/application/use-cases/createDetail.use-case';
import { GetAllDetailsUseCase } from 'src/application/use-cases/getAllDetails.use-case';
import { GetMainCoverUseCase } from 'src/application/use-cases/getMainCover.use-case';
import { GetSubCategoriesBySubcategoryIdUseCase } from 'src/application/use-cases/getSubCategoriesBySubcategoryId.use-case';

@Controller('api/detail')
export class DetailController {
  constructor(
    private readonly createDetailUseCase: CreateDetailUseCase,
    private readonly getAllDetailsUseCase: GetAllDetailsUseCase,
  ) {}

  @Post('createDetail')
  async createDetailController(@Body() createDetailDTO: CreateDetailDTO) {
    return await this.createDetailUseCase.execute(createDetailDTO);
  }

  @Get('getAllDetails')
  async getAllDetailsController() {
    return await this.getAllDetailsUseCase.execute();
  }
}
