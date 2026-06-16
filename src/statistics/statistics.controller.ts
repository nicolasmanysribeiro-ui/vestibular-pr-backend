import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatisticsService } from './statistics.service';

@UseGuards(AuthGuard('jwt'))
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('overview')
  getOverview(@Request() req: any) {
    return this.statisticsService.getOverview(req.user.userId);
  }

  @Get('weekly')
  getWeekly(@Request() req: any) {
    return this.statisticsService.getWeekly(req.user.userId);
  }
}