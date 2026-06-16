import { PrismaService } from '../prisma/prisma.service';
export declare class UniversitiesService {
    private prisma;
    constructor(prisma: PrismaService);
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
