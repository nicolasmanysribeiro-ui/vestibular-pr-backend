import { DisciplinesService } from './disciplines.service';
export declare class DisciplinesController {
    private disciplinesService;
    constructor(disciplinesService: DisciplinesService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        icon: string | null;
        color: string | null;
    }[]>;
}
