import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class LevelingService {
  private readonly LEVELING_PLAN = [
    { name: 'Matemática', questionsPerLevel: 3 },
    { name: 'Física', questionsPerLevel: 2 },
    { name: 'Química', questionsPerLevel: 2 },
    { name: 'Biologia', questionsPerLevel: 2 },
    { name: 'Português', questionsPerLevel: 3 },
    { name: 'Literatura', questionsPerLevel: 1 },
    { name: 'Inglês', questionsPerLevel: 1 },
    { name: 'História', questionsPerLevel: 2 },
    { name: 'Geografia', questionsPerLevel: 2 },
    { name: 'Atualidades', questionsPerLevel: 1 },
  ];

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async getLevelingQuestions(universityId: string) {
    const disciplines = await this.prisma.discipline.findMany({
      where: { name: { in: this.LEVELING_PLAN.map((p) => p.name) } },
    });

    const questions: object[] = [];

    for (const plan of this.LEVELING_PLAN) {
      const discipline = disciplines.find((d) => d.name === plan.name);
      if (!discipline) continue;

      for (let i = 0; i < plan.questionsPerLevel; i++) {
        const real = await this.prisma.realQuestion.findFirst({
          where: {
            universityId,
            disciplineId: discipline.id,
            difficulty: 'MEDIO',
          },
          orderBy: { year: 'desc' },
          skip: i,
        });

        if (real) {
          questions.push({
            id: real.id,
            statement: real.statement,
            alternatives: real.alternatives,
            difficulty: real.difficulty,
            disciplineId: discipline.id,
            disciplineName: discipline.name,
            disciplineIcon: discipline.icon,
            source: 'real',
          });
        } else {
          const generated = await this.ai.generateQuestion(
            universityId,
            discipline.id,
            'MEDIO',
          );
          questions.push({
            ...generated,
            disciplineName: discipline.name,
            disciplineIcon: discipline.icon,
          });
        }
      }
    }

    return questions.sort(() => Math.random() - 0.5);
  }

  async submitLeveling(
    userId: string,
    answers: {
      questionId: string;
      questionSource: 'real' | 'ai';
      disciplineId: string;
      answer: string;
    }[],
  ) {
    const disciplineMap: Record<string, { total: number; correct: number; name: string }> = {};

    for (const ans of answers) {
      const question =
        ans.questionSource === 'real'
          ? await this.prisma.realQuestion.findUnique({ where: { id: ans.questionId } })
          : await this.prisma.aiQuestion.findUnique({ where: { id: ans.questionId } });

      if (!question) continue;

      const isCorrect = question.correctAnswer === ans.answer;
      const discipline = await this.prisma.discipline.findUnique({
        where: { id: ans.disciplineId },
      });

      if (!disciplineMap[ans.disciplineId]) {
        disciplineMap[ans.disciplineId] = {
          total: 0,
          correct: 0,
          name: discipline?.name ?? 'Desconhecida',
        };
      }

      disciplineMap[ans.disciplineId].total++;
      if (isCorrect) disciplineMap[ans.disciplineId].correct++;
    }

    const results = Object.entries(disciplineMap).map(([id, data]) => ({
      disciplineId: id,
      disciplineName: data.name,
      total: data.total,
      correct: data.correct,
      score: data.total > 0 ? (data.correct / data.total) * 10 : 0,
    }));

    const aiReport = await this.ai.generateLevelingReport(
      results.map((r) => ({
        discipline: r.disciplineName,
        total: r.total,
        correct: r.correct,
        score: r.score,
      })),
    );

    const skillsRadar: Record<string, number> = {};
    results.forEach((r) => {
      skillsRadar[r.disciplineName] = parseFloat(r.score.toFixed(2));
    });

    await this.prisma.levelingAssessment.upsert({
      where: { userId },
      update: {
        overallScore: aiReport.overallScore,
        level: aiReport.level,
        skillsRadar,
        report: aiReport.report,
        completedAt: new Date(),
      },
      create: {
        userId,
        overallScore: aiReport.overallScore,
        level: aiReport.level,
        skillsRadar,
        report: aiReport.report,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { hasCompletedLeveling: true },
    });

    return {
      overallScore: aiReport.overallScore,
      level: aiReport.level,
      report: aiReport.report,
      skillsRadar,
      byDiscipline: results,
    };
  }
}