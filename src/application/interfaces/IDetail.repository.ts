import { Details } from 'src/domain/entities/details.entity';

export interface IDetailRepository {
  createDetail(detailDTO: any): Promise<Details>;
  getAllDetails(): Promise<Details[]>;
}
