import { PrismaService } from '../prisma/prisma.service';
export declare class StatisticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(userId: string): Promise<{
        totalAnswered: number;
        totalCorrect: number;
        accuracyPct: number;
        simulationsCompleted: number;
        studyHours: number;
        xp: number | undefined;
        level: number | undefined;
        streakDays: number | undefined;
        byDiscipline: {
            id: string;
            name: string;
            icon: string | null;
            color: string | null;
            answered: number;
            correct: number;
            accuracy: number;
        }[];
    }>;
    getWeekly(userId: string): Promise<{
        label: string;
        date: string;
        answered: number;
        correct: number;
        accuracy: number;
    }[]>;
}
