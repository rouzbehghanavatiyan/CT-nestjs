import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { GetStatusByIdUseCase } from './getStatus.use-case';
import { CreateStatusUseCase } from './createStatus.use-case';
import { CreateStatusDto } from './createStatus.dto';

@Controller('api')
export class ApiController {
  constructor(
    private readonly getStatusByIdUseCase: GetStatusByIdUseCase,
    private readonly createStatusUseCase: CreateStatusUseCase,
  ) {}

  @Get('status/:id')
  async getStatusById(@Param('id', ParseIntPipe) id: number) {
    const res = await this.getStatusByIdUseCase.execute(id);
    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }

  @Post('status')
  async createStatus(@Body() createStatusDto: CreateStatusDto) {
    const res = await this.createStatusUseCase.execute(createStatusDto);
    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }
}
