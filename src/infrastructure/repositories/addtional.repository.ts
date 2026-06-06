import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductName } from '../../domain/entities/productName.entity';
import { IAddtionalRepository } from 'src/application/interfaces/IAddtional.repository';
import { AttachmentEntity } from 'src/domain/entities/attachment.entity';

@Injectable()
export class AddtionalRepository implements IAddtionalRepository {
  constructor(
    @InjectRepository(ProductName)
    private readonly attachment: Repository<AttachmentEntity>,
  ) {}
  async getMoreImages(): Promise<void> {
    const query = `
    select * from attachment_entity 
	where "attachmentType" = 'add'
	order by id desc 
    `;
    return await this.attachment.query(query);
  }
}
