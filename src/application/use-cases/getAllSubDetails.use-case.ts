import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import { Details } from 'src/domain/entities/details.entity';
import type { ISubDetailsRepository } from '../interfaces/ISubDetails.repository';
import { SubDetails } from 'src/domain/entities/subDetails.entity';

@Injectable()
export class GetAllSubDetailsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.SUB_DETAIL)
    private readonly detailsRepository: ISubDetailsRepository,
  ) {}

  async execute(detailId: number): Promise<SubDetails[]> {
    
    const data = await this.detailsRepository.getAllSubDetails(detailId);
    if (!data.length) {
      throw new NotFoundException('آیتمی یافت نشد');
    }
    return data;
  }
}
