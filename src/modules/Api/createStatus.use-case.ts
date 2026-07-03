import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from './IStatus.repository';
import { CreateStatusDto } from './createStatus.dto';

@Injectable()
export class CreateStatusUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(dto: CreateStatusDto, userId: string) {
    const existingStatus = await this.statusRepository.getStatusByUserId(userId);

    if (existingStatus) {
      return await this.statusRepository.update(userId, dto);
    }

    return await this.statusRepository.create({
      ...dto,
      userId,
    });
  }
}
