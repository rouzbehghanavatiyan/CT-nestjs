import { Injectable, Inject } from '@nestjs/common';
import { Features } from '../../domain/entities/features.entity';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IDetailRepository } from '../interfaces/IDetail.repository';
import { Details } from 'src/domain/entities/details.entity';

@Injectable()
export class GetAllDetailsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DETAIL)
    private readonly detailsRepository: IDetailRepository,
  ) {}
  async execute(): Promise<Details[]> {
    return await this.detailsRepository.getAllDetails();
  }
}
