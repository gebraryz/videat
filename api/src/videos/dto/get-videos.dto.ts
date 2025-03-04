import { Transform } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsLocale,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class GetVideosDto {
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  channelId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsLocale()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsOptional()
  @Transform(({ value }) => value.split(","))
  tags?: string[];

  @IsString()
  @IsOptional()
  @IsIn(["clicks", "createdAt"])
  sortBy?: "clicks" | "createdAt" = "clicks";

  @IsString()
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
