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
exports.SimulationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
const ai_service_1 = require("../ai/ai.service");
let SimulationsService = class SimulationsService {
    prisma;
    gamification;
    ai;
    constructor(prisma, gamification, ai) {
        this.prisma = prisma;
        this.gamification = gamification;
        this.ai = ai;
    }
    async createSimulation(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const universityId = dto.universityId ?? user?.selectedUniversityId;
        if (!universityId) {
            throw new Error('Selecione uma universidade antes de criar um simulado');
        }
        const questionIds = [];
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
        const questions = await Promise.all(shuffled.map(async ({ id, source }) => {
            const q = source === 'real'
                ? await this.prisma.realQuestion.findUnique({ where: { id } })
                : await this.prisma.aiQuestion.findUnique({ where: { id } });
            return q ? { ...q, source } : null;
        }));
        return { ...simulation, questions: questions.filter(Boolean) };
    }
    async completeSimulation(userId, simulationId, answers) {
        const simulation = await this.prisma.simulation.findFirst({
            where: { id: simulationId, userId },
        });
        if (!simulation)
            throw new Error('Simulado não encontrado');
        const questionIds = simulation.questionIds;
        let correct = 0;
        const attemptData = [];
        for (const { id, source } of questionIds) {
            const userAnswer = answers[id];
            if (!userAnswer)
                continue;
            const question = source === 'real'
                ? await this.prisma.realQuestion.findUnique({ where: { id } })
                : await this.prisma.aiQuestion.findUnique({ where: { id } });
            if (!question)
                continue;
            const isCorrect = question.correctAnswer === userAnswer;
            if (isCorrect)
                correct++;
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
        await this.gamification.addXp(userId, 'SIMULATION_COMPLETED', `📋 Simulado concluído — Nota: ${score.toFixed(1)}`);
        return {
            simulationId,
            totalQuestions: simulation.totalQuestions,
            correctAnswers: correct,
            score,
            accuracy: parseFloat(((correct / simulation.totalQuestions) * 100).toFixed(1)),
        };
    }
    async getUserSimulations(userId) {
        return this.prisma.simulation.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
            include: { university: { select: { name: true, acronym: true } } },
        });
    }
};
exports.SimulationsService = SimulationsService;
exports.SimulationsService = SimulationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService,
        ai_service_1.AiService])
], SimulationsService);
//# sourceMappingURL=simulations.service.js.map