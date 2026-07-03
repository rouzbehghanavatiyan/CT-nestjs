// getStatus.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IStatusRepository } from './IStatus.repository';

@Injectable()
export class GetStatusByIdUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  // async execute(id: number) {
  //   const status = await this.statusRepository.getStatusById(id);
  //   if (!status) {
  //     throw new NotFoundException('Status not found');
  //   }
  //   return status;
  // }

  async executeByUserId(userId: string) {
    const status = await this.statusRepository.getStatusByUserId(userId);
    if (!status) {
      return null;
    }
    return status;
  }
}
