import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GetStatusByIdUseCase } from './getStatus.use-case';
import { CreateStatusUseCase } from './createStatus.use-case';
import { GetUser } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/status')
@UseGuards(JwtAuthGuard)
export class ApiController {
  constructor(
    private readonly getStatusByIdUseCase: GetStatusByIdUseCase,
    private readonly createStatusUseCase: CreateStatusUseCase,
  ) {}

  @Get('getStatus')
  async getStatus(@GetUser() user: any) {
    const userId = user.userId;
    console.log('userId:', userId);

    const res = await this.getStatusByIdUseCase.executeByUserId(userId);

    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }

  @Post('createStatus')
  async createStatus(@Body() createStatusDto: any, @GetUser() user: any) {
    const userId = user.userId;

    const res = await this.createStatusUseCase.execute(createStatusDto, userId);
    return {
      status: 0,
      data: res,
      message: 'success',
    };
  }
}
