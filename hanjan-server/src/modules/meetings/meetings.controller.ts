import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  getMy(@CurrentUser() user: AuthUser) {
    return this.meetingsService.getMyMeetings(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.meetingsService.findById(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.meetingsService.complete(id);
  }
}
