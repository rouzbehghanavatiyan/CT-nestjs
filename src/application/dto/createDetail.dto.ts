import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDetailDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}