import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
    constructor(private matchingService: MatchingService) { }

    @Post('request/:activityId')
    async request(@Param('activityId') activityId: string, @Req() req: any) {
        return this.matchingService.requestMatch(activityId, req.user.id);
    }

    @Post('respond/:matchId')
    async respond(
        @Param('matchId') matchId: string,
        @Body('accept') accept: boolean,
        @Req() req: any,
    ) {
        return this.matchingService.respondToMatch(matchId, req.user.id, accept);
    }

    @Get('my')
    async getMy(@Req() req: any) {
        return this.matchingService.getMyMatches(req.user.id);
    }
}
