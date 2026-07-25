"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateExam, flattenExam } from "@/lib/questionBank";
import {
    loadInProgressExam,
    saveInProgressExam,
    clearInProgressExam,
    saveAttempt,
} from "@/lib/storage";
import {
    InProgressExam,
    AttemptItem,
    SubjectResult,
    AttemptRecord,
} from "@/lib/types";

function formatTime(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ExamPage() {
    const router = useRouter();
    const [exam, setExam] = useState<InProgressExam | null>(null);
    const [current, setCurrent] = useState(0);
    const [remainingSec, setRemainingSec] = useState<number | null>(null);

    // 시험 로드: 진행중인 시험이 있으면 이어서, 없으면 새로 랜덤 생성
    useEffect(() => {
        const existing = loadInProgressExam();
        if (existing) {
            setExam(existing);
        } else {
            const created = generateExam("공공조달관리사 모의고사");
            saveInProgressExam(created);
            setExam(created);
        }
    }, []);

    const flat = useMemo(() => (exam ? flattenExam(exam) : []), [exam]);

    const finish = useCallback(() => {
        if (!exam) return;

        const items: AttemptItem[] = flat.map((f) => {
            const userAnswer = exam.answers[f.question.id] ?? null;
            return {
                subjectId: f.subjectId,
                subjectName: f.subjectName,
                question: f.question,
                userAnswer,
                correct: userAnswer === f.question.answer,
            };
        });

        const subjectResults: SubjectResult[] = exam.subjects.map((s) => {
            const subjectItems = items.filter((i) => i.subjectId === s.subjectId);
            const correctCount = subjectItems.filter((i) => i.correct).length;
            const totalCount = subjectItems.length;
            const earnedScore =
                totalCount > 0 ? Math.round((correctCount / totalCount) * 10000) / 100 : 0;
            return {
                subjectId: s.subjectId,
                subjectName: s.subjectName,
                correctCount,
                totalCount,
                earnedScore,
                passed: earnedScore >= 40,
            };
        });

        const average =
            subjectResults.reduce((sum, r) => sum + r.earnedScore, 0) /
            (subjectResults.length || 1);

        const passed =
            average >= 60 && subjectResults.every((r) => r.passed);

        const startedMs = new Date(exam.startedAt).getTime();
        const durationSec = Math.round((Date.now() - startedMs) / 1000);

        const record: AttemptRecord = {
            id: `${Date.now()}`,
            examTitle: exam.examTitle,
            date: new Date().toISOString(),
            durationSec,
            timeLimitSec: exam.timeLimitSec,
            subjectResults,
            average: Math.round(average * 100) / 100,
            passed,
            correctCount: items.filter((i) => i.correct).length,
            totalCount: items.length,
            items,
        };

        saveAttempt(record);
        clearInProgressExam();
        router.push(`/result?id=${record.id}`);
    }, [exam, flat, router]);

    // 타이머: startedAt 기준으로 계산하므로 새로고침해도 정확함
    useEffect(() => {
        if (!exam) return;
        const tick = () => {
            const startedMs = new Date(exam.startedAt).getTime();
            const elapsed = Math.floor((Date.now() - startedMs) / 1000);
            const remain = exam.timeLimitSec - elapsed;
            setRemainingSec(Math.max(remain, 0));
            if (remain <= 0) {
                finish();
            }
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [exam, finish]);

    if (!exam || remainingSec === null) {
        return <div className="p-6">시험을 준비하는 중...</div>;
    }

    if (flat.length === 0) {
        return (
            <div className="p-6 max-w-xl mx-auto">
                아직 준비된 문제가 없습니다. 과목별 문제은행에 문항을 추가해주세요.
            </div>
        );
    }

    const item = flat[current];
    const { question, subjectName } = item;
    const selected = exam.answers[question.id];

    function selectAnswer(idx: number) {
        const updated: InProgressExam = {
            ...exam!,
            answers: { ...exam!.answers, [question.id]: idx },
        };
        setExam(updated);
        saveInProgressExam(updated);
    }

    const answeredCount = Object.keys(exam.answers).length;
    const isLow = remainingSec < 300; // 5분 미만이면 강조

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
        <span>
          {current + 1} / {flat.length} (답변 {answeredCount}개)
        </span>
                <span
                    className={`font-mono font-semibold ${
                        isLow ? "text-red-600" : "text-gray-700"
                    }`}
                >
          남은시간 {formatTime(remainingSec)}
        </span>
            </div>

            {/* 과목명 - 큰 타이틀 박스 */}
            <div className="mb-3 border-2 border-gray-800 rounded px-4 py-3 text-center font-bold text-lg">
                과목명 : {subjectName}
            </div>

            {/* 출제기준 배지 */}
            <div className="mb-3 text-xs text-gray-500 bg-gray-100 rounded px-3 py-2 leading-relaxed">
                <span className="font-medium text-gray-600">출제기준</span>
                <span className="mx-1">·</span>
                <span className="font-semibold">{question.category.main}</span>
                <span className="mx-1">/</span>
                <span>{question.category.sub}</span>
                <span className="mx-1">/</span>
                <span>{question.category.detail}</span>
            </div>

            <h2 className="text-lg font-semibold mb-4">{question.text}</h2>

            <div className="space-y-2">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        className={`w-full text-left p-3 rounded border ${
                            selected === idx
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                        }`}
                    >
                        {idx + 1}. {opt}
                    </button>
                ))}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    disabled={current === 0}
                    onClick={() => setCurrent((c) => c - 1)}
                    className="disabled:opacity-30"
                >
                    이전
                </button>

                {current < flat.length - 1 ? (
                    <button onClick={() => setCurrent((c) => c + 1)}>다음</button>
                ) : (
                    <button onClick={finish} className="font-bold text-blue-600">
                        제출하고 채점하기
                    </button>
                )}
            </div>
        </div>
    );
}
