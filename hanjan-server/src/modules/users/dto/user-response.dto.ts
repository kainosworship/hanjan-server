export class UserResponseDto {
  id: string;
  nickname: string;
  bio?: string;
  profileImageUrl?: string;
  isIdVerified: boolean;
  isSelfieVerified: boolean;
}
