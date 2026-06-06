import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubDetailDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  detailId: number;

  @Column()
  subDetailId: number;
}
