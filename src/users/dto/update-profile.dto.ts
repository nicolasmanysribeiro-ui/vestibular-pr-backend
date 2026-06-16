import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class SelectUniversityDto {
  @IsUUID()
  universityId: string;
}