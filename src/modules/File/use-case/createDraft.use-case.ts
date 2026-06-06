import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../contans/token';
import type { IVideoAttachRepository } from '../IRepositories/IVideoAttach.repository';

@Injectable()
export class CreateDraftUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.VIDEO_ATTACH)
    private readonly videoAttachRepository: IVideoAttachRepository,
  ) {}

  async execute(data: {
    fileName: string;
    size: number;
    mimeType: string;
  }) {
    return await this.videoAttachRepository.createDraft(data);
  }
}
