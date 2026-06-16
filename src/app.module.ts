import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UniversitiesModule } from './universities/universities.module';
import { DisciplinesModule } from './disciplines/disciplines.module';
import { QuestionsModule } from './questions/questions.module';
import { SimulationsModule } from './simulations/simulations.module';
import { LevelingModule } from './leveling/leveling.module';
import { AiModule } from './ai/ai.module';
import { GamificationModule } from './gamification/gamification.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    UniversitiesModule,
    DisciplinesModule,
    QuestionsModule,
    SimulationsModule,
    LevelingModule,
    AiModule,
    GamificationModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}