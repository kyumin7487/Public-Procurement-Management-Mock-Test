import raw from "@/data/questions.json";

export interface QuestionCategory {
    main: string;
    sub: string;
    detail: string;
}

export interface Question {
    id: string;
    number: number;
    category: QuestionCategory;
    text: string;
    options: string[];
    answer: number;
    explanation: string;
}

export interface ExamSet {
    id: string;
    title: string;
    questions: Question[];
}

export function getExamSets(): ExamSet[] {
    return raw.examSets as ExamSet[];
}

export function getExamSet(id: string): ExamSet | undefined {
    return getExamSets().find((s) => s.id === id);
}