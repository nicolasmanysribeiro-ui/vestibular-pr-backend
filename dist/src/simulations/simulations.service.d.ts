import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { AiService } from '../ai/ai.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
export declare class SimulationsService {
    private prisma;
    private gamification;
    private ai;
    constructor(prisma: PrismaService, gamification: GamificationService, ai: AiService);
    createSimulation(userId: string, dto: CreateSimulationDto): Promise<{
        questions: ({
            source: "ai" | "real";
            id: string;
            createdAt: Date;
            year: number;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            questionType: import("@prisma/client").$Enums.QuestionType;
            statement: string;
            alternatives: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string;
            explanation: string | null;
            tags: string[];
            universityId: string;
            disciplineId: string;
        } | {
            source: "ai" | "real";
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
        } | null)[];
        id: string;
        title: string | null;
        universityId: string | null;
        userId: string;
        status: import("@prisma/client").$Enums.SimulationStatus;
        timeSpent: number | null;
        totalQuestions: number;
        correctAnswers: number;
        score: import("@prisma/client/runtime/library").Decimal;
        questionIds: import("@prisma/client/runtime/library").JsonValue;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    completeSimulation(userId: string, simulationId: string, answers: Record<string, string>): Promise<{
        simulationId: string;
        totalQuestions: number;
        correctAnswers: number;
        score: number;
        accuracy: number;
    }>;
    getUserSimulations(userId: string): Promise<({
        university: {
            name: string;
            acronym: string;
        } | null;
    } & {
        id: string;
        title: string | null;
        universityId: string | null;
        userId: string;
        status: import("@prisma/client").$Enums.SimulationStatus;
        timeSpent: number | null;
        totalQuestions: number;
        correctAnswers: number;
        score: import("@prisma/client/runtime/library").Decimal;
        questionIds: import("@prisma/client/runtime/library").JsonValue;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        startedAt: Date;
        completedAt: Date | null;
    })[]>;
}
