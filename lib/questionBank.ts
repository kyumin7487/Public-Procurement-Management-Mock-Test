import raw from "@/data/questions.json";
import { QuestionBankData, Question, ExamSubject, InProgressExam } from "./types";

const bank = raw as QuestionBankData;

export const EXAM_TIME_LIMIT_SEC = 2 * 60 * 60; // 시험시간 2시간

export function getSubjectBanks() {
    return bank.subjects;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function generateExam(examTitle: string): InProgressExam {
    const subjects: ExamSubject[] = bank.subjects.map((subject) => {
        const pickCount = Math.min(subject.requiredCount, subject.questions.length);
        const picked = shuffle(subject.questions).slice(0, pickCount);
        return {
            subjectId: subject.id,
            subjectName: subject.name,
            requiredCount: subject.requiredCount,
            availableCount: picked.length,
            questions: picked,
        };
    });

    return {
        examTitle,
        startedAt: new Date().toISOString(),
        timeLimitSec: EXAM_TIME_LIMIT_SEC,
        subjects,
        answers: {},
    };
}

export function flattenExam(exam: InProgressExam): {
    subjectId: string;
    subjectName: string;
    question: Question;
}[] {
    return exam.subjects.flatMap((s) =>
        s.questions.map((q) => ({
            subjectId: s.subjectId,
            subjectName: s.subjectName,
            question: q,
        }))
    );
}

export function getAllQuestionsFlat(): {
    subjectId: string;
    subjectName: string;
    question: Question;
}[] {
    return bank.subjects.flatMap((s) =>
        s.questions.map((q) => ({
            subjectId: s.id,
            subjectName: s.name,
            question: q,
        }))
    );
}
