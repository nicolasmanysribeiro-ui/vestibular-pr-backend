"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
const ai_service_1 = require("../ai/ai.service");
let QuestionsService = class QuestionsService {
    prisma;
    gamification;
    ai;
    constructor(prisma, gamification, ai) {
        this.prisma = prisma;
        this.gamification = gamification;
        this.ai = ai;
    }
    async getNextAdaptiveQuestion(userId, disciplineId, universityId) {
        const profile = await this.getUserDisciplineProfile(userId, disciplineId);
        const difficulty = this.decideDifficulty(profile);
        const useRealQuestion = Math.random() < 0.3;
        if (useRealQuestion) {
            const realQuestion = await this.getRealQuestion(universityId, disciplineId, difficulty, userId);
            if (realQuestion)
                return { ...realQuestion, source: 'real' };
        }
        const aiQuestion = await this.ai.generateQuestion(universityId, disciplineId, difficulty);
        return { ...aiQuestion, source: 'ai' };
    }
    async answerQuestion(userId, dto) {
        const question = dto.questionSource === 'real'
            ? await this.prisma.realQuestion.findUnique({ where: { id: dto.questionId } })
            : await this.prisma.aiQuestion.findUnique({ where: { id: dto.questionId } });
        if (!question)
            throw new Error('Questão não encontrada');
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
        let errorAnalysis = null;
        if (!isCorrect) {
            errorAnalysis = await this.ai.analyzeError(dto.questionId, dto.answer, dto.questionSource === 'real');
        }
        return {
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            errorAnalysis,
            attemptId: attempt.id,
        };
    }
    async getUserDisciplineProfile(userId, disciplineId) {
        const recent = await this.prisma.attempt.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        const total = recent.length;
        const correct = recent.filter((a) => a.isCorrect).length;
        const accuracy = total > 0 ? correct / total : 0.5;
        return { total, correct, accuracy, lastDifficulty: 'MEDIO' };
    }
    decideDifficulty(profile) {
        if (profile.accuracy > 0.75) {
            if (profile.lastDifficulty === 'FACIL')
                return 'MEDIO';
            return 'DIFICIL';
        }
        if (profile.accuracy < 0.4) {
            if (profile.lastDifficulty === 'DIFICIL')
                return 'MEDIO';
            return 'FACIL';
        }
        return profile.lastDifficulty;
    }
    async getRealQuestion(universityId, disciplineId, difficulty, userId) {
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
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService,
        ai_service_1.AiService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map