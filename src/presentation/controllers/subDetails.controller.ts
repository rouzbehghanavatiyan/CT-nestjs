import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateSubDetailDTO } from 'src/application/dto/createSubDetails.dto';
import { CreateSubDetailsUseCase } from 'src/application/use-cases/createSubDetails.use-case';
import { GetAllSubDetailsUseCase } from 'src/application/use-cases/getAllSubDetails.use-case';
import { SuccessMessage } from '../decorators/success-message.decorator';

@Controller('api/subDetails')
export class SubDetailsController {
  constructor(
    private readonly getAllSubDetailsUseCase: GetAllSubDetailsUseCase,
    private readonly createSubDetailsUseCase: CreateSubDetailsUseCase,
  ) {}

  @Get('allSubDetails/:detailId')
  @SuccessMessage('لیست زیرمشخصات دریافت شد')
  async getAllSubDetailsController(
    @Param('detailId', ParseIntPipe) detailId: number,
  ) {
    return await this.getAllSubDetailsUseCase.execute(detailId);
  }

  @Post('createSubDetails')
  async createDetailController(@Body() createDetailDTO: CreateSubDetailDTO) {
    return await this.createSubDetailsUseCase.execute(createDetailDTO);
  }
}
