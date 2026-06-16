import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';

@UseGuards(AuthGuard('jwt'))
@Controller('gamification')
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.gamificationService.getUserDashboard(req.user.userId);
  }

  @Get('ranking')
  getRanking() {
    return this.gamificationService.getRanking();
  }
}