import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { AiService } from '../ai/ai.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Injectable()
export class SimulationsService {
  constructor(
    private prisma: PrismaService,
    private gamification: GamificationService,
    private ai: AiService,
  ) {}

  async createSimulation(userId: string, dto: CreateSimulationDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const universityId = dto.universityId ?? user?.selectedUniversityId;

    if (!universityId) {
      throw new Error('Selecione uma universidade antes de criar um simulado');
    }

    const questionIds: { id: string; source: 'real' | 'ai' }[] = [];
    const disciplines = dto.disciplineIds?.length
      ? dto.disciplineIds
      : await this.prisma.discipline
          .findMany({ select: { id: true } })
          .then((ds) => ds.map((d) => d.id));

    const questionsPerDiscipline = Math.ceil(dto.totalQuestions / disciplines.length);
    const difficulty = dto.difficulty ?? 'MEDIO';

    for (const disciplineId of disciplines) {
      const realLimit = Math.floor(questionsPerDiscipline / 2);

      const realQs = await this.prisma.realQuestion.findMany({
        where: { universityId, disciplineId, difficulty },
        take: realLimit,
        orderBy: { year: 'desc' },
        select: { id: true },
      });

      realQs.forEach((q) => questionIds.push({ id: q.id, source: 'real' }));

      const needed = questionsPerDiscipline - realQs.length;
      for (let i = 0; i < needed; i++) {
        const generated = await this.ai.generateQuestion(universityId, disciplineId, difficulty);
        questionIds.push({ id: generated.id, source: 'ai' });
      }
    }

    const shuffled = questionIds.sort(() => Math.random() - 0.5).slice(0, dto.totalQuestions);

    const simulation = await this.prisma.simulation.create({
      data: {
        userId,
        universityId,
        title: dto.title ?? `Simulado ${new Date().toLocaleDateString('pt-BR')}`,
        totalQuestions: shuffled.length,
        questionIds: shuffled,
        status: 'IN_PROGRESS',
      },
    });

    const questions = await Promise.all(
      shuffled.map(async ({ id, source }) => {
        const q =
          source === 'real'
            ? await this.prisma.realQuestion.findUnique({ where: { id } })
            : await this.prisma.aiQuestion.findUnique({ where: { id } });
        return q ? { ...q, source } : null;
      }),
    );

    return { ...simulation, questions: questions.filter(Boolean) };
  }

  async completeSimulation(userId: string, simulationId: string, answers: Record<string, string>) {
    const simulation = await this.prisma.simulation.findFirst({
      where: { id: simulationId, userId },
    });

    if (!simulation) throw new Error('Simulado não encontrado');

    const questionIds = simulation.questionIds as { id: string; source: string }[];
    let correct = 0;
    const attemptData: {
      userId: string;
      questionId: string;
      questionSource: string;
      answer: string;
      isCorrect: boolean;
      simulationId: string;
    }[] = [];

    for (const { id, source } of questionIds) {
      const userAnswer = answers[id];
      if (!userAnswer) continue;

      const question =
        source === 'real'
          ? await this.prisma.realQuestion.findUnique({ where: { id } })
          : await this.prisma.aiQuestion.findUnique({ where: { id } });

      if (!question) continue;

      const isCorrect = question.correctAnswer === userAnswer;
      if (isCorrect) correct++;

      attemptData.push({
        userId,
        questionId: id,
        questionSource: source,
        answer: userAnswer,
        isCorrect,
        simulationId,
      });
    }

    await this.prisma.attempt.createMany({ data: attemptData });

    const score = parseFloat(((correct / simulation.totalQuestions) * 10).toFixed(2));

    await this.prisma.simulation.update({
      where: { id: simulationId },
      data: {
        correctAnswers: correct,
        score,
        status: 'COMPLETED',
        answers,
        completedAt: new Date(),
      },
    });

    await this.gamification.addXp(
      userId,
      'SIMULATION_COMPLETED',
      `📋 Simulado concluído — Nota: ${score.toFixed(1)}`,
    );

    return {
      simulationId,
      totalQuestions: simulation.totalQuestions,
      correctAnswers: correct,
      score,
      accuracy: parseFloat(((correct / simulation.totalQuestions) * 100).toFixed(1)),
    };
  }

  async getUserSimulations(userId: string) {
    return this.prisma.simulation.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { university: { select: { name: true, acronym: true } } },
    });
  }
}