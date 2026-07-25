import { InProgressExam, AttemptRecord } from "./types";

const IN_PROGRESS_KEY = "exam-in-progress";
const HISTORY_KEY = "exam-attempts";

// ---------- 진행중 시험 (새로고침해도 유지) ----------
export function saveInProgressExam(exam: InProgressExam) {
    localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(exam));
}

export function loadInProgressExam(): InProgressExam | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(IN_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearInProgressExam() {
    localStorage.removeItem(IN_PROGRESS_KEY);
}

// ---------- 응시 기록 ----------
export function saveAttempt(record: AttemptRecord) {
    const list = getAttempts();
    list.push(record);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function getAttempts(): AttemptRecord[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getAttemptById(id: string): AttemptRecord | undefined {
    return getAttempts().find((a) => a.id === id);
}

export function clearAttempts() {
    localStorage.removeItem(HISTORY_KEY);
}
