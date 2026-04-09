import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryActivitiesDto {
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  lng: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusKm?: number;

  @IsOptional()
  @IsEnum(['coffee', 'meal', 'drink', 'walk', 'culture', 'anything'])
  category?: string;

  @IsOptional()
  @IsEnum(['1:1', '2:2', 'group'])
  groupSize?: string;
}
