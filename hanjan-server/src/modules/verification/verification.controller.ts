import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('id-card')
  verifyIdCard(@CurrentUser() user: AuthUser, @Body() body: { imageUrl: string }) {
    return this.verificationService.verifyIdCard(user.id, body.imageUrl);
  }

  @Post('face-match')
  faceMatch(@CurrentUser() user: AuthUser, @Body() body: { selfieUrl: string }) {
    return this.verificationService.faceMatch(user.id, body.selfieUrl);
  }

  @Get('status')
  getStatus(@CurrentUser() user: AuthUser) {
    return this.verificationService.getStatus(user.id);
  }
}
