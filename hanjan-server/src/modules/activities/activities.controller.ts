import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(user.id, dto);
  }

  @Get('nearby')
  getNearby(@CurrentUser() user: AuthUser, @Query() query: QueryActivitiesDto) {
    return this.activitiesService.getNearby(user.id, query);
  }

  @Get('my')
  getMy(@CurrentUser() user: AuthUser) {
    return this.activitiesService.getMyActivities(user.id);
  }

  @Get('daily-count')
  getDailyCount(@CurrentUser() user: AuthUser) {
    return this.activitiesService.getDailyCount(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.activitiesService.findById(id);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.activitiesService.cancel(user.id, id);
  }
}
