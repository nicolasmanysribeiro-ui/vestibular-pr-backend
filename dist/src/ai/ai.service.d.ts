import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private prisma;
    private client;
    constructor(prisma: PrismaService);
    generateQuestion(universityId: string, disciplineId: string, difficulty: 'FACIL' | 'MEDIO' | 'DIFICIL'): Promise<{
        source: "ai";
        id: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        questionType: import("@prisma/client").$Enums.QuestionType;
        statement: string;
        alternatives: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string;
        explanation: string | null;
        disciplineId: string;
        generationPrompt: string | null;
        generatedAt: Date;
        baseUniversityId: string;
        inspiredBy: string | null;
    }>;
    analyzeError(questionId: string, userAnswer: string, isRealQuestion: boolean): Promise<string>;
    generateLevelingReport(results: {
        discipline: string;
        total: number;
        correct: number;
        score: number;
    }[]): Promise<{
        overallScore: number;
        level: string;
        report: string;
        skillsRadar: Record<string, number>;
    }>;
}
