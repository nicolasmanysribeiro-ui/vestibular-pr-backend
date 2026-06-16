import { LevelingService } from './leveling.service';
import { SubmitLevelingDto } from './dto/submit-leveling.dto';
export declare class LevelingController {
    private levelingService;
    constructor(levelingService: LevelingService);
    getQuestions(universityId: string): Promise<object[]>;
    submit(req: any, dto: SubmitLevelingDto): Promise<{
        overallScore: number;
        level: string;
        report: string;
        skillsRadar: Record<string, number>;
        byDiscipline: {
            disciplineId: string;
            disciplineName: string;
            total: number;
            correct: number;
            score: number;
        }[];
    }>;
}
