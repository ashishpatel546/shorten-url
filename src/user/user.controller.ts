import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/plan')
  async updatePlan(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto
  ) {
    return this.userService.updatePlan(id, updatePlanDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('usage-stats')
  async getUsageStats() {
    return this.userService.getUsageStats();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('reset-requests')
  async resetRequestCount() {
    return this.userService.resetDailyLimits();
  }
}
