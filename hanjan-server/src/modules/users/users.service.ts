import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                interests: true,
                subscription: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, data: { nickname?: string; bio?: string; interests?: string[] }) {
        const { interests, ...profileData } = data;

        return await this.prisma.$transaction(async (tx) => {
            // Update basic profile
            const user = await tx.user.update({
                where: { id: userId },
                data: profileData,
            });

            // Update interests if provided
            if (interests) {
                // Clear old interests
                await tx.userInterest.deleteMany({ where: { userId } });
                // Create new ones
                await tx.userInterest.createMany({
                    data: interests.map((tag) => ({ userId, tag })),
                });
            }

            return user;
        });
    }

    async updateLocation(userId: string, lat: number, lng: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                lastLocationLat: lat,
                lastLocationLng: lng,
                lastLocationAt: new Date(),
            },
        });
    }

    async updatePushToken(userId: string, token: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { expoPushToken: token },
        });
    }

    async getMannerScore(userId: string) {
        return this.prisma.mannerScore.findUnique({
            where: { userId },
        });
    }
}
