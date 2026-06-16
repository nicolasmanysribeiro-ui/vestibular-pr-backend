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
exports.GamificationService = exports.LEVELS = exports.XP_TABLE = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.XP_TABLE = {
    QUESTION_ANSWERED: 5,
    QUESTION_CORRECT: 10,
    SIMULATION_COMPLETED: 50,
    WEEKLY_GOAL_COMPLETED: 100,
    STREAK_7_DAYS: 30,
    STREAK_30_DAYS: 100,
    ACHIEVEMENT_UNLOCK: 0,
};
exports.LEVELS = [
    { level: 1, minXp: 0, title: 'Calouro' },
    { level: 2, minXp: 100, title: 'Estudante' },
    { level: 3, minXp: 250, title: 'Dedicado' },
    { level: 4, minXp: 500, title: 'Aplicado' },
    { level: 5, minXp: 1000, title: 'Focado' },
    { level: 6, minXp: 2000, title: 'Veterano' },
    { level: 7, minXp: 3500, title: 'Expert' },
    { level: 8, minXp: 5500, title: 'Mestre' },
    { level: 9, minXp: 8000, title: 'Gênio' },
    { level: 10, minXp: 12000, title: 'Vestibulando Elite' },
];
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addXp(userId, eventType, description) {
        const amount = exports.XP_TABLE[eventType] ?? 0;
        await this.prisma.xpEvent.create({
            data: { userId, eventType, xpAmount: amount, description },
        });
        if (amount === 0)
            return { xpGained: 0 };
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: amount } },
        });
        const newLevel = this.calculateLevel(user.xp);
        const leveledUp = newLevel > user.level;
        if (leveledUp) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { level: newLevel },
            });
        }
        this.checkAchievements(userId).catch(console.error);
        return {
            xpGained: amount,
            totalXp: user.xp,
            level: newLevel,
            leveledUp,
            levelTitle: exports.LEVELS.find((l) => l.level === newLevel)?.title,
        };
    }
    calculateLevel(xp) {
        const reached = exports.LEVELS.filter((l) => xp >= l.minXp);
        return reached[reached.length - 1]?.level ?? 1;
    }
    getLevelProgress(xp) {
        const currentLevel = this.calculateLevel(xp);
        const current = exports.LEVELS.find((l) => l.level === currentLevel);
        const next = exports.LEVELS.find((l) => l.level === currentLevel + 1);
        if (!next)
            return { percentage: 100, xpNeeded: 0 };
        const range = next.minXp - current.minXp;
        const progress = xp - current.minXp;
        return {
            percentage: Math.round((progress / range) * 100),
            xpNeeded: next.minXp - xp,
            nextLevel: next,
        };
    }
    async updateStreak(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { streakDays: true, lastStudyDate: true },
        });
        if (!user)
            return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
        if (lastStudy) {
            lastStudy.setHours(0, 0, 0, 0);
            if (today.getTime() === lastStudy.getTime())
                return;
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const newStreak = lastStudy.getTime() === yesterday.getTime() ? user.streakDays + 1 : 1;
            await this.prisma.user.update({
                where: { id: userId },
                data: { streakDays: newStreak, lastStudyDate: new Date() },
            });
            if (newStreak === 7)
                await this.addXp(userId, 'STREAK_7_DAYS', '🔥 7 dias seguidos de estudo!');
            if (newStreak === 30)
                await this.addXp(userId, 'STREAK_30_DAYS', '🏆 30 dias seguidos!');
        }
        else {
            await this.prisma.user.update({
                where: { id: userId },
                data: { streakDays: 1, lastStudyDate: new Date() },
            });
        }
    }
    async checkAchievements(userId) {
        const [stats, achievements, userAchievements] = await Promise.all([
            this.getUserStats(userId),
            this.prisma.achievement.findMany(),
            this.prisma.userAchievement.findMany({ where: { userId } }),
        ]);
        const unlockedIds = new Set(userAchievements.map((a) => a.achievementId));
        const newlyUnlocked = [];
        for (const achievement of achievements) {
            if (unlockedIds.has(achievement.id))
                continue;
            const earned = this.evaluateAchievement(achievement, stats);
            if (!earned)
                continue;
            await this.prisma.userAchievement.create({
                data: { userId, achievementId: achievement.id },
            });
            if (achievement.xpReward > 0) {
                await this.prisma.xpEvent.create({
                    data: {
                        userId,
                        eventType: 'ACHIEVEMENT_UNLOCK',
                        xpAmount: achievement.xpReward,
                        description: `🏅 Conquista desbloqueada: ${achievement.title}`,
                    },
                });
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { xp: { increment: achievement.xpReward } },
                });
            }
            newlyUnlocked.push(achievement.title);
        }
        return newlyUnlocked;
    }
    evaluateAchievement(achievement, stats) {
        switch (achievement.conditionType) {
            case 'questions_answered':
                return stats.totalAnswered >= achievement.conditionValue;
            case 'questions_correct':
                return stats.totalCorrect >= achievement.conditionValue;
            case 'streak_days':
                return stats.streakDays >= achievement.conditionValue;
            case 'simulations_completed':
                return stats.simulationsCompleted >= achievement.conditionValue;
            case 'daily_questions':
                return stats.dailyQuestions >= achievement.conditionValue;
            default:
                return false;
        }
    }
    async getUserStats(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalAnswered, totalCorrect, simulationsCompleted, dailyQuestions, user] = await Promise.all([
            this.prisma.attempt.count({ where: { userId } }),
            this.prisma.attempt.count({ where: { userId, isCorrect: true } }),
            this.prisma.simulation.count({
                where: { userId, status: 'COMPLETED' },
            }),
            this.prisma.attempt.count({
                where: { userId, createdAt: { gte: today, lt: tomorrow } },
            }),
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { streakDays: true },
            }),
        ]);
        return {
            totalAnswered,
            totalCorrect,
            simulationsCompleted,
            dailyQuestions,
            streakDays: user?.streakDays ?? 0,
        };
    }
    async getRanking(limit = 20) {
        return this.prisma.user.findMany({
            orderBy: { xp: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                xp: true,
                level: true,
                streakDays: true,
                avatarUrl: true,
            },
        });
    }
    async getUserDashboard(userId) {
        const [user, achievements, goals, recentXp] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    xp: true,
                    level: true,
                    streakDays: true,
                    name: true,
                    avatarUrl: true,
                },
            }),
            this.prisma.userAchievement.findMany({
                where: { userId },
                include: { achievement: true },
                orderBy: { unlockedAt: 'desc' },
                take: 10,
            }),
            this.prisma.goal.findMany({
                where: { userId, isCompleted: false },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.xpEvent.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const levelProgress = this.getLevelProgress(user.xp);
        return { user, levelProgress, achievements, goals, recentXp };
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map