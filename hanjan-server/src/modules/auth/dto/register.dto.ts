import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(['male', 'female', 'other'])
  gender: string;
}
