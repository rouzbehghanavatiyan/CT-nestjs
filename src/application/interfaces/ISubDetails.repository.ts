import { SubDetails } from 'src/domain/entities/subDetails.entity';
import { CreateSubDetailDTO } from '../dto/createSubDetails.dto';

export interface ISubDetailsRepository {
  getAllSubDetails(detailId: number): Promise<SubDetails[]>;
  createSubDetails(createSubDetailDTO: CreateSubDetailDTO): Promise<SubDetails>;
}
