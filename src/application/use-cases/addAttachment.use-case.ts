import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../constants/tokens';
import type { IAttachmentRepository } from '../interfaces/IAttachment.repository';
import { AttachmentEntity } from 'src/domain/entities/attachment.entity';

@Injectable()
export class AddAttachmentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.ATTACHMENT)
    private readonly attachmentRep: IAttachmentRepository,
  ) {}

  async execute(data: any): Promise<any> {
    console.log(data);
    return await this.attachmentRep.addAttachment(data);
  }


}

// // src/application/use-cases/addAttachment.use-case.ts
// import { Injectable } from '@nestjs/common';
// import { IAttachmentRepository } from '../interfaces/IAttachment.repository';

// interface AddAttachmentRequest {
//   title: string;
//   description?: string;
//   fileName?: string;
//   originalName?: string;
//   mimeType?: string;
//   size?: number;
//   filePath?: string;
// }

// @Injectable()
// export class AddAttachmentUseCase {
//   constructor(
//     private readonly attachmentRepository: IAttachmentRepository,
//   ) {}

//   async execute(request: AddAttachmentRequest) {
//     const attachmentData = {
//       title: request.title,
//       description: request.description,
//       fileName: request.fileName,
//       originalName: request.originalName,
//       mimeType: request.mimeType,
//       size: request.size,
//       filePath: request.filePath,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     return await this.attachmentRepository.addAttachment(attachmentData);
//   }
// }
