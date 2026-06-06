import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDetailRepository } from 'src/application/interfaces/IDetail.repository';
import { Details } from 'src/domain/entities/details.entity';
import { CreateDetailDTO } from 'src/application/dto/createDetail.dto';

@Injectable()
export class DetailRepository implements IDetailRepository {
  constructor(
    @InjectRepository(Details)
    private readonly detail: Repository<Details>,
  ) {}

  async createDetail(detailDTO: CreateDetailDTO): Promise<Details> {
    const detail = this.detail.create(detailDTO);
    return await this.detail.save(detail);
  }
  
  async getAllDetails(): Promise<Details[]> {
    const result = this.detail.find();
    return result;
  }
}
