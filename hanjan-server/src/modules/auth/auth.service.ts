import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Gender } from '@prisma/client';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redis.set(`otp:${phone}`, otp, 300);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP sent for phone ending in ...${phone.slice(-4)}`);
    }
    return { message: 'OTP 전송 완료' };
  }

  async verifyOtp(phone: string, code: string): Promise<{ verified: boolean; token: string }> {
    const stored = await this.redis.getVal(`otp:${phone}`);
    if (!stored || stored !== code) {
      throw new UnauthorizedException('잘못된 인증 코드입니다.');
    }
    await this.redis.del(`otp:${phone}`);
    const token = this.jwtService.sign({ phone, type: 'phone_verified' }, { expiresIn: 600 });
    return { verified: true, token };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException('이미 가입된 전화번호입니다.');

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        nickname: dto.nickname,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender as Gender,
        isPhoneVerified: true,
      },
    });

    return this.generateTokens(user.id);
  }

  async login(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user || !user.isPhoneVerified) {
      throw new UnauthorizedException('가입된 계정을 찾을 수 없습니다.');
    }
    return this.generateTokens(user.id);
  }

  async refreshTokens(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.generateTokens(userId);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.redis.del(`refresh:${userId}`);
    return { message: '로그아웃 완료' };
  }

  private async generateTokens(userId: string) {
    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshRefreshDays = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS ?? '7', 10);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: refreshRefreshDays * 24 * 60 * 60,
    });
    await this.redis.set(`refresh:${userId}`, refreshToken, 7 * 24 * 60 * 60);
    return { accessToken, refreshToken };
  }
}
