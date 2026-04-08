import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getMe(@Req() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Patch('profile')
    async updateProfile(
        @Req() req: any,
        @Body() data: { nickname?: string; bio?: string; interests?: string[] },
    ) {
        return this.usersService.updateProfile(req.user.id, data);
    }

    @Patch('location')
    async updateLocation(
        @Req() req: any,
        @Body() data: { lat: number; lng: number },
    ) {
        return this.usersService.updateLocation(req.user.id, data.lat, data.lng);
    }

    @Patch('push-token')
    async updatePushToken(@Req() req: any, @Body() data: { token: string }) {
        return this.usersService.updatePushToken(req.user.id, data.token);
    }

    @Get('manner-score')
    async getMannerScore(@Req() req: any) {
        return this.usersService.getMannerScore(req.user.id);
    }
}
