import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        avatarUrl: string | null;
        selectedUniversityId: string | null;
        xp: number;
        level: number;
        streakDays: number;
        hasCompletedLeveling: boolean;
        selectedUniversity: {
            id: string;
            name: string;
            acronym: string;
        } | null;
    } | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    }>;
    selectUniversity(userId: string, universityId: string): Promise<{
        id: string;
        selectedUniversityId: string | null;
        selectedUniversity: {
            name: string;
            acronym: string;
        } | null;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
