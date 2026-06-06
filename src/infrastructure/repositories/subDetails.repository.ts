import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubDetailsRepository } from 'src/application/interfaces/ISubDetails.repository';
import { SubDetails } from 'src/domain/entities/subDetails.entity';
import { CreateSubDetailDTO } from 'src/application/dto/createSubDetails.dto';

@Injectable()
export class SubDetailRepository implements ISubDetailsRepository {
  constructor(
    @InjectRepository(SubDetails)
    private readonly subDetailRepository: Repository<SubDetails>,
  ) {}

async getAllSubDetails(detailId: number): Promise<SubDetails[]> {
  return this.subDetailRepository.find({
    where: {
      detailId: {
        id: detailId,
      },
    },
  });
}

  async createSubDetails(
    createSubDetailDTO: CreateSubDetailDTO,
  ): Promise<SubDetails> {
    const subDetails = this.subDetailRepository.create({
      title: createSubDetailDTO.title,
      detailId: { id: createSubDetailDTO.detailId },
    });
    return await this.subDetailRepository.save(subDetails);
  }
}
