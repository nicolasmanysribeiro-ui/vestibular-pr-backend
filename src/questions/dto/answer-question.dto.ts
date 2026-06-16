import { IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class AnswerQuestionDto {
  @IsUUID()
  questionId: string;

  @IsIn(['real', 'ai'])
  questionSource: 'real' | 'ai';

  @IsString()
  answer: string;

  @IsInt()
  @IsOptional()
  timeSpent?: number;

  @IsUUID()
  @IsOptional()
  simulationId?: string;
}