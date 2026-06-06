import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class CreateDescriptionDto {
  @IsString()
  content: string;
}

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  subcategoryId?: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  en_name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  // @ValidateNested()
  @Type(() => CreateDescriptionDto)
  des?: CreateDescriptionDto;

  @IsOptional()
  features: [];
}
