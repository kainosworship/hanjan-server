import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('meeting/:meetingId')
  getByMeeting(@Param('meetingId') meetingId: string) {
    return this.reviewsService.getByMeeting(meetingId);
  }

  @Get('check/:meetingId')
  checkCompleted(@CurrentUser() user: AuthUser, @Param('meetingId') meetingId: string) {
    return this.reviewsService.checkCompleted(user.id, meetingId);
  }
}
