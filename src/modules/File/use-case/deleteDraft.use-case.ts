import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../contans/token';
import type { IVideoAttachRepository } from '../IRepositories/IVideoAttach.repository';

@Injectable()
export class DeleteDraftUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.VIDEO_ATTACH)
    private readonly videoAttachRepository: IVideoAttachRepository,
  ) {}

  async execute(draftId: string) {
    // return await this.videoAttachRepository.deleteDraft(draftId);
  }
}
