import { QuestionsService } from './questions.service';
import { AnswerQuestionDto } from './dto/answer-question.dto';
export declare class QuestionsController {
    private questionsService;
    constructor(questionsService: QuestionsService);
    getNext(req: any, disciplineId: string, universityId: string): Promise<{
        source: string;
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
        source: string;
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
    answer(req: any, dto: AnswerQuestionDto): Promise<{
        isCorrect: boolean;
        correctAnswer: string;
        explanation: string | null;
        errorAnalysis: string | null;
        attemptId: string;
    }>;
}
