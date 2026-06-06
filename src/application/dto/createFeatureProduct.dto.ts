import { Type } from 'class-transformer';
import { IsNumber, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateFeatureProductDTO {
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  featureId: number[];
}
