import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    getDashboard(req: any): Promise<{
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
    getRanking(): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        xp: number;
        level: number;
        streakDays: number;
    }[]>;
}
