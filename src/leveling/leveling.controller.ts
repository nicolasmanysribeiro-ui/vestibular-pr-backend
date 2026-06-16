import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LevelingService } from './leveling.service';
import { SubmitLevelingDto } from './dto/submit-leveling.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('leveling')
export class LevelingController {
  constructor(private levelingService: LevelingService) {}

  @Get('questions')
  getQuestions(@Query('universityId') universityId: string) {
    return this.levelingService.getLevelingQuestions(universityId);
  }

  @Post('submit')
  submit(@Request() req: any, @Body() dto: SubmitLevelingDto) {
    return this.levelingService.submitLeveling(req.user.userId, dto.answers);
  }
}