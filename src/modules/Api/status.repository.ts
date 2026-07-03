import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from './status.entity';
import { IStatusRepository } from './IStatus.repository';

@Injectable()
export class StatusRepository implements IStatusRepository {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly repository: Repository<StatusEntity>,
  ) {}

  async create(data: Partial<StatusEntity>): Promise<StatusEntity> {
    const status = this.repository.create(data);
    return await this.repository.save(status);
  }

  async getStatusByUserId(userId: string): Promise<StatusEntity | null> {
    return await this.repository.findOne({
      where: { userId: userId },
    });
  }
  async update(
    userId: string,
    data: Partial<StatusEntity>,
  ): Promise<StatusEntity> {
    const status = await this.getStatusByUserId(userId);
    if (!status) {
      throw new Error('Status record not found for update');
    }

    Object.assign(status, data);
    return await this.repository.save(status);
  }
}
