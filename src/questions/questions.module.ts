import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { GamificationModule } from '../gamification/gamification.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [GamificationModule, AiModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}