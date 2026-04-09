import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { interests: true, mannerScore: true, subscription: true },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        bio: dto.bio,
        profileImageUrl: dto.profileImageUrl,
      },
    });
  }

  async updateLocation(id: string, lat: number, lng: number) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLocationLat: lat, lastLocationLng: lng, lastLocationAt: new Date() },
    });
  }

  async getStats(id: string) {
    const [activityCount, meetingCount] = await Promise.all([
      this.prisma.activity.count({ where: { userId: id } }),
      this.prisma.meeting.count({
        where: { match: { OR: [{ requesterId: id }, { accepterId: id }] }, status: 'COMPLETED' },
      }),
    ]);
    return { activityCount, meetingCount };
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        bio: true,
        profileImageUrl: true,
        isIdVerified: true,
        isSelfieVerified: true,
        interests: true,
        mannerScore: true,
      },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }
}
