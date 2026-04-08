import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../providers/prisma.service';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async sendOtp(phone: String) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // In production, send via Aligo/SMS provider
        // For now, we'll log it or store in Redis
        console.log(`[OTP] ${phone}: ${otp}`);

        // Clean up old OTPs for this phone
        await this.prisma.$executeRaw`
      DELETE FROM "ChatMessage" WHERE "content" = ${phone} AND "messageType" = 'SYSTEM'
    `;

        // We'll use a temporary approach or Redis for OTP storage
        // For MVP, let's assume valid for now if fixed OTP '123456' or similar
        return { success: true, message: 'OTP sent' };
    }

    async verifyOtpAndLogin(phone: string, otp: string) {
        // Dummy verification for now
        if (otp !== '123456') {
            throw new UnauthorizedException('Invalid OTP');
        }

        let user = await this.prisma.user.findUnique({
            where: { phone },
        });

        const isNewUser = !user;

        if (!user) {
            // Create partial user for onboarding
            user = await this.prisma.user.create({
                data: {
                    phone,
                    nickname: `User_${nanoid(5)}`,
                    birthDate: new Date('1995-01-01'), // Default, to be updated in onboarding
                    gender: 'other',
                    isPhoneVerified: true,
                },
            });

            // Create referral code for new user
            await this.prisma.referralCode.create({
                data: {
                    userId: user.id,
                    code: `HJ-${nanoid(8).toUpperCase()}`,
                },
            });
        }

        const payload = { sub: user.id, phone: user.phone };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
            user,
            isNewUser,
        };
    }

    async validateUser(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
