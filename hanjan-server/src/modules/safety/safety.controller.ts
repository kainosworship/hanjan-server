import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { EmergencyDto } from './dto/emergency.dto';

@UseGuards(JwtAuthGuard)
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('report')
  report(@CurrentUser() user: AuthUser, @Body() dto: CreateReportDto) {
    return this.safetyService.createReport(user.id, dto);
  }

  @Post('emergency')
  emergency(@CurrentUser() user: AuthUser, @Body() body: EmergencyDto) {
    return this.safetyService.sendEmergency(user.id, body.location);
  }

  @Patch('location-share')
  locationShare(@CurrentUser() user: AuthUser, @Body() body: { enabled: boolean }) {
    return this.safetyService.updateLocationShare(user.id, body.enabled);
  }
}
