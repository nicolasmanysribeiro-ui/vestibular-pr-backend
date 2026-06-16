import { UniversitiesService } from './universities.service';
export declare class UniversitiesController {
    private universitiesService;
    constructor(universitiesService: UniversitiesService);
    findAll(): Promise<{
        description: string | null;
        id: string;
        name: string;
        acronym: string;
        state: string;
        logoUrl: string | null;
        website: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        acronym: string;
        state: string;
        logoUrl: string | null;
        website: string | null;
        createdAt: Date;
    } | null>;
}
