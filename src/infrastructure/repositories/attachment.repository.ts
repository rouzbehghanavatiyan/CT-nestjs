import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { IAttachmentRepository } from 'src/application/interfaces/IAttachment.repository';
import { AttachmentEntity } from 'src/domain/entities/attachment.entity';
import { ProductName } from 'src/domain/entities/productName.entity';

@Injectable()
export class AttachmentRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepo: Repository<AttachmentEntity>,

    @InjectRepository(ProductName)
    private readonly productRepo: Repository<ProductName>,
  ) {}

  async addAttachment(data: any): Promise<AttachmentEntity> {
    let product: ProductName | null = null;

    if (data.productId !== null && data.productId !== undefined) {
      const productId = Number(data.productId);

      if (Number.isNaN(productId)) {
        throw new Error('Invalid productId');
      }

      product = await this.productRepo.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product not found with id ${productId}`);
      }
    }

    const attachment = this.attachmentRepo.create({
      fileName: data.fileName,
      ext: data.ext,
      attachmentType: data.attachmentType,
      product: { id: data.productId },
    });

    return this.attachmentRepo.save(attachment);
  }
}
