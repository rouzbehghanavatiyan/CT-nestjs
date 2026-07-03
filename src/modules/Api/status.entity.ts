import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StatusEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column('nvarchar', { nullable: true })
  bio: string | null;

  @Column('nvarchar', { nullable: true })
  location: string | null;

  @Column('nvarchar', { nullable: true })
  mail: string | null;
}
