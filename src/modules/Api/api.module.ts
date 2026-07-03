import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { StatusEntity } from './status.entity';
import { GetStatusByIdUseCase } from './getStatus.use-case';
import { CreateStatusUseCase } from './createStatus.use-case';
import { StatusRepository } from './status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatusEntity])],
  controllers: [ApiController],
  providers: [
    ApiService,
    GetStatusByIdUseCase,
    CreateStatusUseCase,
    {
      provide: 'IStatusRepository',
      useClass: StatusRepository,
    },
    CreateStatusUseCase,
  ],
})
export class ApiModule {}
