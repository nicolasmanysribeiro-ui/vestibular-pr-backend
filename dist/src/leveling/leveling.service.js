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
exports.LevelingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let LevelingService = class LevelingService {
    prisma;
    ai;
    LEVELING_PLAN = [
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
    constructor(prisma, ai) {
        this.prisma = prisma;
        this.ai = ai;
    }
    async getLevelingQuestions(universityId) {
        const disciplines = await this.prisma.discipline.findMany({
            where: { name: { in: this.LEVELING_PLAN.map((p) => p.name) } },
        });
        const questions = [];
        for (const plan of this.LEVELING_PLAN) {
            const discipline = disciplines.find((d) => d.name === plan.name);
            if (!discipline)
                continue;
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
                }
                else {
                    const generated = await this.ai.generateQuestion(universityId, discipline.id, 'MEDIO');
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
    async submitLeveling(userId, answers) {
        const disciplineMap = {};
        for (const ans of answers) {
            const question = ans.questionSource === 'real'
                ? await this.prisma.realQuestion.findUnique({ where: { id: ans.questionId } })
                : await this.prisma.aiQuestion.findUnique({ where: { id: ans.questionId } });
            if (!question)
                continue;
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
            if (isCorrect)
                disciplineMap[ans.disciplineId].correct++;
        }
        const results = Object.entries(disciplineMap).map(([id, data]) => ({
            disciplineId: id,
            disciplineName: data.name,
            total: data.total,
            correct: data.correct,
            score: data.total > 0 ? (data.correct / data.total) * 10 : 0,
        }));
        const aiReport = await this.ai.generateLevelingReport(results.map((r) => ({
            discipline: r.disciplineName,
            total: r.total,
            correct: r.correct,
            score: r.score,
        })));
        const skillsRadar = {};
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
};
exports.LevelingService = LevelingService;
exports.LevelingService = LevelingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], LevelingService);
//# sourceMappingURL=leveling.service.js.map