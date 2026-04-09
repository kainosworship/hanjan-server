import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PrismaService } from '../../providers/prisma.service';
import { RedisService } from '../../providers/redis.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? (process.env.NODE_ENV === 'production' ? (() => { throw new Error('JWT_SECRET must be set'); })() : 'dev_secret_change_me'),
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_SECONDS ?? '900', 10) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, PrismaService, RedisService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
