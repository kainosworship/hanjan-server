import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
    constructor(private activitiesService: ActivitiesService) { }

    @Post()
    async create(@Req() req: any, @Body() data: any) {
        return this.activitiesService.createActivity(req.user.id, data);
    }

    @Get('nearby')
    async getNearby(
        @Query('lat') lat: string,
        @Query('lng') lng: string,
        @Query('radius') radius: string,
    ) {
        return this.activitiesService.getNearbyActivities(
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(radius || '5'),
        );
    }

    @Get(':id')
    async getOne(@Req() req: any) {
        return this.activitiesService.getActivityById(req.params.id);
    }
}
