import { IsArray, IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSimulationDto {
  @IsUUID()
  @IsOptional()
  universityId?: string;

  @IsArray()
  @IsOptional()
  disciplineIds?: string[];

  @IsIn(['FACIL', 'MEDIO', 'DIFICIL'])
  @IsOptional()
  difficulty?: 'FACIL' | 'MEDIO' | 'DIFICIL';

  @IsInt()
  totalQuestions: number;

  @IsString()
  @IsOptional()
  title?: string;
}

export class CompleteSimulationDto {
  answers: Record<string, string>;
}