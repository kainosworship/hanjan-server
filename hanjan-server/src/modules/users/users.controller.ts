import { Controller, Get, Patch, Body, UseGuards, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth.types';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('me/location')
  updateLocation(@CurrentUser() user: AuthUser, @Body() body: { lat: number; lng: number }) {
    return this.usersService.updateLocation(user.id, body.lat, body.lng);
  }

  @Get('me/stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.usersService.getStats(user.id);
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
