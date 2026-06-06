import { IsOptional, IsString } from "class-validator";

export class UpdateDesDto {
  @IsOptional()
  @IsString()
  content?: string;
}
