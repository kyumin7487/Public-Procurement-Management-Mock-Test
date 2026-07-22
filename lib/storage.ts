export interface SubjectResult {
    subjectId: string;
    subjectName: string;
    earnedScore: number;
    maxScore: number;
    passed: boolean;
}

export interface AttemptRecord {
    examSetId: string;
    examTitle: string;
    date: string; // ISO
    subjectResults: SubjectResult[];
    average: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    durationSec: number;
    wrongQuestionIds: string[];
}

const KEY = "exam-attempts";

export function saveAttempt(record: AttemptRecord) {
    const list = getAttempts();
    list.push(record);
    localStorage.setItem(KEY, JSON.stringify(list));
}

export function getAttempts(): AttemptRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getLastAttempt(): AttemptRecord | undefined {
    const list = getAttempts();
    return list[list.length - 1];
}

export function clearAttempts() {
    localStorage.removeItem(KEY);
}