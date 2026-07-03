import { StatusEntity } from './status.entity';

export interface IStatusRepository {
  create(data: Partial<StatusEntity>): Promise<StatusEntity>;
  getStatusByUserId(userId: string): Promise<StatusEntity | null>;
  // getStatusById()
  update(userId: string, data: Partial<StatusEntity>): Promise<StatusEntity>;
}
