import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IDetailRepository } from '../interfaces/IDetail.repository';

@Injectable()
export class CreateDetailUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DETAIL)
    private readonly mainProductRepository: IDetailRepository,
  ) {}

  async execute(createDTO: any) {
    return await this.mainProductRepository.createDetail(createDTO);
  }
}
