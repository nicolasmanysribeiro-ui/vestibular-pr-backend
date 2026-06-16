export class LevelingAnswerDto {
  questionId: string;
  questionSource: 'real' | 'ai';
  disciplineId: string;
  answer: string;
}

export class SubmitLevelingDto {
  universityId: string;
  answers: LevelingAnswerDto[];
}