import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from './status.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async getStatusById(id: number): Promise<StatusEntity | null> {
    return this.statusRepository.findOne({ where: { id } });
  }

  async createStatus(data: Partial<StatusEntity>): Promise<StatusEntity> {
    const entity = this.statusRepository.create(data);
    return this.statusRepository.save(entity);
  }
}
