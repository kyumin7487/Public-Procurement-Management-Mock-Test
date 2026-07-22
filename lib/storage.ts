export interface AttemptRecord {
    examSetId: string;
    examTitle: string;
    date: string; // ISO
    score: number; // 정답 수
    total: number;
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

export function getAttemptsBySet(examSetId: string): AttemptRecord[] {
    return getAttempts().filter((a) => a.examSetId === examSetId);
}

export function clearAttempts() {
    localStorage.removeItem(KEY);
}