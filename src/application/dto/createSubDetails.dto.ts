import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubDetailDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  detailId: number;
}
