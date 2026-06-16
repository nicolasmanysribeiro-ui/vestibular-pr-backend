import { PrismaService } from '../prisma/prisma.service';
export declare const XP_TABLE: Record<string, number>;
export declare const LEVELS: {
    level: number;
    minXp: number;
    title: string;
}[];
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    addXp(userId: string, eventType: string, description: string): Promise<{
        xpGained: number;
        totalXp?: undefined;
        level?: undefined;
        leveledUp?: undefined;
        levelTitle?: undefined;
    } | {
        xpGained: number;
        totalXp: number;
        level: number;
        leveledUp: boolean;
        levelTitle: string | undefined;
    }>;
    calculateLevel(xp: number): number;
    getLevelProgress(xp: number): {
        percentage: number;
        xpNeeded: number;
        nextLevel?: undefined;
    } | {
        percentage: number;
        xpNeeded: number;
        nextLevel: {
            level: number;
            minXp: number;
            title: string;
        };
    };
    updateStreak(userId: string): Promise<void>;
    checkAchievements(userId: string): Promise<string[]>;
    private evaluateAchievement;
    private getUserStats;
    getRanking(limit?: number): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        xp: number;
        level: number;
        streakDays: number;
    }[]>;
    getUserDashboard(userId: string): Promise<{
        user: {
            name: string;
            avatarUrl: string | null;
            xp: number;
            level: number;
            streakDays: number;
        } | null;
        levelProgress: {
            percentage: number;
            xpNeeded: number;
            nextLevel?: undefined;
        } | {
            percentage: number;
            xpNeeded: number;
            nextLevel: {
                level: number;
                minXp: number;
                title: string;
            };
        };
        achievements: ({
            achievement: {
                description: string | null;
                id: string;
                createdAt: Date;
                icon: string | null;
                code: string;
                title: string;
                xpReward: number;
                conditionType: string;
                conditionValue: number;
            };
        } & {
            id: string;
            userId: string;
            achievementId: string;
            unlockedAt: Date;
        })[];
        goals: {
            id: string;
            createdAt: Date;
            userId: string;
            goalType: string;
            targetValue: number;
            currentValue: number;
            period: string;
            isCompleted: boolean;
            deadline: Date;
        }[];
        recentXp: {
            description: string | null;
            id: string;
            createdAt: Date;
            eventType: string;
            xpAmount: number;
            userId: string;
        }[];
    }>;
}
