import { IsString, IsInt, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  meetingId: string;

  @IsString()
  reviewedUserId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  conversationScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  punctualityScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  remeetScore: number;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  comment?: string;
}
