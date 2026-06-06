import { AttachmentEntity } from 'src/domain/entities/attachment.entity';

export interface IAttachmentRepository {
  addAttachment(data: any): Promise<AttachmentEntity>;
}
