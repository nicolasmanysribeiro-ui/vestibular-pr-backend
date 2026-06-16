import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestionsService } from './questions.service';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get('next')
  getNext(
    @Request() req: any,
    @Query('disciplineId') disciplineId: string,
    @Query('universityId') universityId: string,
  ) {
    return this.questionsService.getNextAdaptiveQuestion(
      req.user.userId,
      disciplineId,
      universityId,
    );
  }

  @Post('answer')
  answer(@Request() req: any, @Body() dto: AnswerQuestionDto) {
    return this.questionsService.answerQuestion(req.user.userId, dto);
  }
}