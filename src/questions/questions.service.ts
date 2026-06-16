import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { AiService } from '../ai/ai.service';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    private gamification: GamificationService,
    private ai: AiService,
  ) {}

  async getNextAdaptiveQuestion(
    userId: string,
    disciplineId: string,
    universityId: string,
  ) {
    const profile = await this.getUserDisciplineProfile(userId, disciplineId);
    const difficulty = this.decideDifficulty(profile);

    const useRealQuestion = Math.random() < 0.3;

    if (useRealQuestion) {
      const realQuestion = await this.getRealQuestion(
        universityId,
        disciplineId,
        difficulty,
        userId,
      );
      if (realQuestion) return { ...realQuestion, source: 'real' };
    }

    const aiQuestion = await this.ai.generateQuestion(
      universityId,
      disciplineId,
      difficulty,
    );
    return { ...aiQuestion, source: 'ai' };
  }

  async answerQuestion(userId: string, dto: AnswerQuestionDto) {
    const question =
      dto.questionSource === 'real'
        ? await this.prisma.realQuestion.findUnique({ where: { id: dto.questionId } })
        : await this.prisma.aiQuestion.findUnique({ where: { id: dto.questionId } });

    if (!question) throw new Error('Questão não encontrada');

    const isCorrect = question.correctAnswer === dto.answer;

    const attempt = await this.prisma.attempt.create({
      data: {
        userId,
        questionId: dto.questionId,
        questionSource: dto.questionSource,
        answer: dto.answer,
        isCorrect,
        timeSpent: dto.timeSpent,
        simulationId: dto.simulationId,
      },
    });

    await this.gamification.addXp(userId, 'QUESTION_ANSWERED', 'Questão respondida');
    if (isCorrect) {
      await this.gamification.addXp(userId, 'QUESTION_CORRECT', 'Questão correta');
    }
    await this.gamification.updateStreak(userId);

    let errorAnalysis: string | null = null;
    if (!isCorrect) {
      errorAnalysis = await this.ai.analyzeError(
        dto.questionId,
        dto.answer,
        dto.questionSource === 'real',
      );
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      errorAnalysis,
      attemptId: attempt.id,
    };
  }

  private async getUserDisciplineProfile(userId: string, disciplineId: string) {
    const recent = await this.prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const total = recent.length;
    const correct = recent.filter((a) => a.isCorrect).length;
    const accuracy = total > 0 ? correct / total : 0.5;

    return { total, correct, accuracy, lastDifficulty: 'MEDIO' as const };
  }

  private decideDifficulty(profile: {
    accuracy: number;
    lastDifficulty: string;
  }): 'FACIL' | 'MEDIO' | 'DIFICIL' {
    if (profile.accuracy > 0.75) {
      if (profile.lastDifficulty === 'FACIL') return 'MEDIO';
      return 'DIFICIL';
    }
    if (profile.accuracy < 0.4) {
      if (profile.lastDifficulty === 'DIFICIL') return 'MEDIO';
      return 'FACIL';
    }
    return profile.lastDifficulty as 'FACIL' | 'MEDIO' | 'DIFICIL';
  }

  private async getRealQuestion(
    universityId: string,
    disciplineId: string,
    difficulty: 'FACIL' | 'MEDIO' | 'DIFICIL',
    userId: string,
  ) {
    const answeredIds = await this.prisma.attempt.findMany({
      where: { userId, questionSource: 'real' },
      select: { questionId: true },
    });

    const excludeIds = answeredIds.map((a) => a.questionId);

    return this.prisma.realQuestion.findFirst({
      where: {
        universityId,
        disciplineId,
        difficulty,
        id: { notIn: excludeIds },
      },
      orderBy: { year: 'desc' },
    });
  }
}