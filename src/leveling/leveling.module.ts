import { Module } from '@nestjs/common';
import { LevelingService } from './leveling.service';
import { LevelingController } from './leveling.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [LevelingController],
  providers: [LevelingService],
})
export class LevelingModule {}