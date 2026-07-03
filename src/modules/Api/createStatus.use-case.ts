import { Injectable } from '@nestjs/common';
import { ApiService } from './api.service';
import { StatusEntity } from './status.entity';
import { CreateStatusDto } from './createStatus.dto';

@Injectable()
export class CreateStatusUseCase {
  constructor(private readonly apiService: ApiService) {}
  async execute(dto: CreateStatusDto): Promise<StatusEntity> {
    return this.apiService.createStatus(dto);
  }
}
