import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

@Entity('Status')
export class StatusEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  mail: string;

  @Column({
    name: 'UserId',
    type: 'nvarchar',
    length: 450,
    nullable: false,
    unique: true,
  })
  userId: string;
}
