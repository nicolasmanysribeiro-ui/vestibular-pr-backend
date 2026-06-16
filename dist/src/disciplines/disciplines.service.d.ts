import { PrismaService } from '../prisma/prisma.service';
export declare class DisciplinesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        icon: string | null;
        color: string | null;
    }[]>;
}
