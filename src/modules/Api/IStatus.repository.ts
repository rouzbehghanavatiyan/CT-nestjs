// status-repository.interface.ts
import { StatusEntity } from './status.entity';

export interface IStatusRepository {
  getStatusById(id: number): Promise<StatusEntity | null>;
  createStatus(data: Partial<StatusEntity>): Promise<StatusEntity>;
}
