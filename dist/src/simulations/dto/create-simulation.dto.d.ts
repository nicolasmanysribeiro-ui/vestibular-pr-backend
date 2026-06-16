export declare class CreateSimulationDto {
    universityId?: string;
    disciplineIds?: string[];
    difficulty?: 'FACIL' | 'MEDIO' | 'DIFICIL';
    totalQuestions: number;
    title?: string;
}
export declare class CompleteSimulationDto {
    answers: Record<string, string>;
}
