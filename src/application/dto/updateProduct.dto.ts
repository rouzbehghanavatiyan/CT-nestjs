import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductDto {
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
  name?: string;

  @IsOptional()
  @IsString()
  en_name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceProduct?: number;

  @IsOptional()
  @IsString()
  title?: string;
}
