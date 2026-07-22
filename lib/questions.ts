import raw from "@/data/questions.json";

export interface QuestionCategory {
    main: string;
    sub: string;
    detail: string;
}

export interface Question {
    id: string;
    number: number;
    score: number;
    category: QuestionCategory;
    text: string;
    options: string[];
    answer: number;
    explanation: string;
}

export interface Subject {
    id: string;
    name: string;
    questions: Question[];
}

export interface ExamSet {
    id: string;
    title: string;
    subjects: Subject[];
}

export function getExamSets(): ExamSet[] {
    return raw.examSets as ExamSet[];
}

export function getExamSet(id: string): ExamSet | undefined {
    return getExamSets().find((s) => s.id === id);
}

export function getTotalQuestionCount(examSet: ExamSet): number {
    return examSet.subjects.reduce((sum, s) => sum + s.questions.length, 0);
}

export interface FlatQuestion {
    subjectId: string;
    subjectName: string;
    question: Question;
}

export function flattenQuestions(examSet: ExamSet): FlatQuestion[] {
    return examSet.subjects.flatMap((subject) =>
        subject.questions.map((question) => ({
            subjectId: subject.id,
            subjectName: subject.name,
            question,
        }))
    );
}