export declare class AnswerQuestionDto {
    questionId: string;
    questionSource: 'real' | 'ai';
    answer: string;
    timeSpent?: number;
    simulationId?: string;
}
