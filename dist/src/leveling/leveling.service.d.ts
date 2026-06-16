import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class LevelingService {
    private prisma;
    private ai;
    private readonly LEVELING_PLAN;
    constructor(prisma: PrismaService, ai: AiService);
    getLevelingQuestions(universityId: string): Promise<object[]>;
    submitLeveling(userId: string, answers: {
        questionId: string;
        questionSource: 'real' | 'ai';
        disciplineId: string;
        answer: string;
    }[]): Promise<{
        overallScore: number;
        level: string;
        report: string;
        skillsRadar: Record<string, number>;
        byDiscipline: {
            disciplineId: string;
            disciplineName: string;
            total: number;
            correct: number;
            score: number;
        }[];
    }>;
}
