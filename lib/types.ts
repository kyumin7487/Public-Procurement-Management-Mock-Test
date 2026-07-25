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
    answer: number; // 정답 인덱스 (0~3)
    explanation: string;
}

export interface SubjectBank {
    id: string;
    name: string;
    requiredCount: number; // 시험에서 이 과목에 출제할 문항 수
    questions: Question[]; // 문제은행 전체 풀
}

export interface QuestionBankData {
    subjects: SubjectBank[];
}

// ---- 시험 진행 중 상태 ----
export interface ExamSubject {
    subjectId: string;
    subjectName: string;
    requiredCount: number;
    availableCount: number; // 실제 뽑힌 문항 수 (풀이 부족하면 requiredCount보다 작을 수 있음)
    questions: Question[]; // 랜덤으로 뽑히고 섞인 문항들
}

export interface InProgressExam {
    examTitle: string;
    startedAt: string; // ISO
    timeLimitSec: number;
    subjects: ExamSubject[];
    answers: Record<string, number>; // questionId -> 선택한 보기 인덱스
}

// ---- 채점 결과 / 기록 ----
export interface AttemptItem {
    subjectId: string;
    subjectName: string;
    question: Question;
    userAnswer: number | null;
    correct: boolean;
}

export interface SubjectResult {
    subjectId: string;
    subjectName: string;
    correctCount: number;
    totalCount: number;
    earnedScore: number; // 100점 만점 환산
    passed: boolean; // 40점 이상
}

export interface AttemptRecord {
    id: string;
    examTitle: string;
    date: string; // ISO
    durationSec: number;
    timeLimitSec: number;
    subjectResults: SubjectResult[];
    average: number;
    passed: boolean; // 평균 60점 이상 AND 전 과목 40점 이상
    correctCount: number;
    totalCount: number;
    items: AttemptItem[];
}
