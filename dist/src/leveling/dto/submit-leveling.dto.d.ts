export declare class LevelingAnswerDto {
    questionId: string;
    questionSource: 'real' | 'ai';
    disciplineId: string;
    answer: string;
}
export declare class SubmitLevelingDto {
    universityId: string;
    answers: LevelingAnswerDto[];
}
