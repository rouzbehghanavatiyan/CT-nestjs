import { Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { ISubDetailsRepository } from '../interfaces/ISubDetails.repository';
import { CreateSubDetailDTO } from '../dto/createSubDetails.dto';
import { SubDetails } from 'src/domain/entities/subDetails.entity';

export class CreateSubDetailsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.SUB_DETAIL)
    private readonly subDetailsRepo: ISubDetailsRepository,
  ) {}
  async execute(createSubDetailDTO: CreateSubDetailDTO): Promise<SubDetails> {
    return await this.subDetailsRepo.createSubDetails(createSubDetailDTO);
  }
}
