export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  phone: string;
  nickname: string;
  birthDate: Date;
  gender: Gender;
  bio?: string;
  profileImageUrl?: string;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  isSelfieVerified: boolean;
  selfieUpdatedAt?: Date;
  lastLocationLat?: number;
  lastLocationLng?: number;
  lastLocationAt?: Date;
  isActive: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  interests?: string[];
  expoPushToken?: string;
}

export interface UserProfile extends Pick<User, 'id' | 'nickname' | 'bio' | 'profileImageUrl' | 'isIdVerified' | 'isSelfieVerified'> {
  mannerScore?: number;
  totalMeetings?: number;
  verifiedBadge: boolean;
  isPlus: boolean;
}

export interface UpdateProfileDto {
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
  interests?: string[];
}

export interface LocationUpdate {
  lat: number;
  lng: number;
}
