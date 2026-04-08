import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Post()
    async submit(@Req() req: any, @Body() data: any) {
        return this.reviewsService.submitReview(req.user.id, data);
    }

    @Get('profile/:userId')
    async getProfile(@Param('userId') userId: string) {
        return this.reviewsService.getUserMannerProfile(userId);
    }
}
