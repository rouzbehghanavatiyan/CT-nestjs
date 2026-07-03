import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiService } from './api.service';
import { StatusEntity } from './status.entity';

@Injectable()
export class GetStatusByIdUseCase {
  constructor(private readonly apiService: ApiService) {}

  async execute(id: number): Promise<StatusEntity> {
    const status = await this.apiService.getStatusById(id);
    if (!status) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }
    return status;
  }
}
