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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatisticsService = class StatisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(userId) {
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
        const accuracyPct = totalAnswered > 0 ? parseFloat(((totalCorrect / totalAnswered) * 100).toFixed(1)) : 0;
        const studyHours = Math.round((studyTime._sum.timeSpent ?? 0) / 3600);
        const disciplines = await this.prisma.discipline.findMany();
        const byDiscipline = await Promise.all(disciplines.map(async (d) => {
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
        }));
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
    async getWeekly(userId) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const result = [];
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
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map