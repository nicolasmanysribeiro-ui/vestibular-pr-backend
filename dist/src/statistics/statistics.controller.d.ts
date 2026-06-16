import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private statisticsService;
    constructor(statisticsService: StatisticsService);
    getOverview(req: any): Promise<{
        totalAnswered: number;
        totalCorrect: number;
        accuracyPct: number;
        simulationsCompleted: number;
        studyHours: number;
        xp: number | undefined;
        level: number | undefined;
        streakDays: number | undefined;
        byDiscipline: {
            id: string;
            name: string;
            icon: string | null;
            color: string | null;
            answered: number;
            correct: number;
            accuracy: number;
        }[];
    }>;
    getWeekly(req: any): Promise<{
        label: string;
        date: string;
        answered: number;
        correct: number;
        accuracy: number;
    }[]>;
}
