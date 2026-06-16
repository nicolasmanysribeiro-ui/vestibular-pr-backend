import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { GamificationModule } from '../gamification/gamification.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [GamificationModule, AiModule],
  controllers: [SimulationsController],
  providers: [SimulationsService],
})
export class SimulationsModule {}