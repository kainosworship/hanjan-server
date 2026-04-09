import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateActivityDto {
  @IsEnum(['coffee', 'meal', 'drink', 'walk', 'culture', 'anything'])
  category: string;

  @IsEnum(['now', '30min', '1hour', 'tonight', 'custom'])
  timing: string;

  @IsDateString()
  scheduledAt: string;

  @IsNumber()
  radiusKm: 1 | 2 | 5;

  @IsEnum(['1:1', '2:2', 'group'])
  groupSize: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsNumber()
  locationLat: number;

  @IsNumber()
  locationLng: number;

  @IsOptional()
  @IsString()
  venueName?: string;

  @IsOptional()
  @IsString()
  venueAddress?: string;
}
