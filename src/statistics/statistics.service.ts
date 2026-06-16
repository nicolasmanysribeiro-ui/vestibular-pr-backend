import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [user, totalAnswered, totalCorrect, simulations, studyTime] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.attempt.count({ where: { userId } }),
      this.prisma.attempt.count({ where: { userId, isCorrect: true } }),
      this.prisma.simulation.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.attempt.aggregate({
        where: { userId },
        _sum: { timeSpent: true },
      }),
    ]);

    const accuracyPct =
      totalAnswered > 0 ? parseFloat(((totalCorrect / totalAnswered) * 100).toFixed(1)) : 0;

    const studyHours = Math.round((studyTime._sum.timeSpent ?? 0) / 3600);

    const disciplines = await this.prisma.discipline.findMany();
    const byDiscipline = await Promise.all(
      disciplines.map(async (d) => {
        const [answered, correct] = await Promise.all([
          this.prisma.attempt.count({ where: { userId } }),
          this.prisma.attempt.count({ where: { userId, isCorrect: true } }),
        ]);
        return {
          id: d.id,
          name: d.name,
          icon: d.icon,
          color: d.color,
          answered,
          correct,
          accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
        };
      }),
    );

    return {
      totalAnswered,
      totalCorrect,
      accuracyPct,
      simulationsCompleted: simulations,
      studyHours,
      xp: user?.xp,
      level: user?.level,
      streakDays: user?.streakDays,
      byDiscipline: byDiscipline.filter((d) => d.answered > 0),
    };
  }

  async getWeekly(userId: string) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const result: {
      label: string;
      date: string;
      answered: number;
      correct: number;
      accuracy: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [answered, correct] = await Promise.all([
        this.prisma.attempt.count({
          where: { userId, createdAt: { gte: date, lt: nextDate } },
        }),
        this.prisma.attempt.count({
          where: { userId, isCorrect: true, createdAt: { gte: date, lt: nextDate } },
        }),
      ]);

      result.push({
        label: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        answered,
        correct,
        accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      });
    }

    return result;
  }
}