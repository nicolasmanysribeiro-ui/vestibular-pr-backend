import { UsersService } from './users.service';
import { UpdateProfileDto, SelectUniversityDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    }>;
    selectUniversity(req: any, dto: SelectUniversityDto): Promise<{
        id: string;
        selectedUniversityId: string | null;
        selectedUniversity: {
            name: string;
            acronym: string;
        } | null;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
