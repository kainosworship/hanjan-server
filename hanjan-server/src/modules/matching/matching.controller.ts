import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':activityId/request')
  requestMatch(@CurrentUser() user: AuthUser, @Param('activityId') activityId: string) {
    return this.matchingService.requestMatch(user.id, activityId);
  }

  @Post(':matchId/accept')
  acceptMatch(@CurrentUser() user: AuthUser, @Param('matchId') matchId: string) {
    return this.matchingService.respondMatch(user.id, matchId, true);
  }

  @Post(':matchId/reject')
  rejectMatch(@CurrentUser() user: AuthUser, @Param('matchId') matchId: string) {
    return this.matchingService.respondMatch(user.id, matchId, false);
  }

  @Get('pending')
  getPending(@CurrentUser() user: AuthUser) {
    return this.matchingService.getPendingMatches(user.id);
  }

  @Get('daily-count')
  getDailyCount(@CurrentUser() user: AuthUser) {
    return this.matchingService.getDailyCount(user.id);
  }

  @Get('meetings/:meetingId')
  getMeeting(@CurrentUser() user: AuthUser, @Param('meetingId') meetingId: string) {
    return this.matchingService.getMeeting(meetingId, user.id);
  }
}
