import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  reportedUserId: string;

  @IsEnum(['inappropriate_behavior', 'fake_profile', 'harassment', 'no_show', 'spam', 'other'])
  reason: string;

  @IsOptional()
  @IsString()
  description?: string;
}
