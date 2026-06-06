import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
