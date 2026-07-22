"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getExamSet, flattenQuestions } from "@/lib/questions";
import { saveAttempt, SubjectResult } from "@/lib/storage";

export default function ExamPage() {
    const params = useSearchParams();
    const router = useRouter();
    const examSet = getExamSet(params.get("id") ?? "");
    const flat = useMemo(() => (examSet ? flattenQuestions(examSet) : []), [examSet]);

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [startTime] = useState(Date.now());

    if (!examSet || flat.length === 0) {
        return <div className="p-6">문제 세트를 찾을 수 없습니다.</div>;
    }

    const item = flat[current];
    const { question, subjectName } = item;

    function selectAnswer(idx: number) {
        setAnswers((prev) => ({ ...prev, [current]: idx }));
    }

    function finish() {
        const subjectResults: SubjectResult[] = examSet!.subjects.map((subject) => {
            const maxScore = subject.questions.reduce((sum, q) => sum + q.score, 0);
            const earnedScore = subject.questions.reduce((sum, q) => {
                const idxInFlat = flat.findIndex((f) => f.question.id === q.id);
                const isCorrect = answers[idxInFlat] === q.answer;
                return sum + (isCorrect ? q.score : 0);
            }, 0);

            return {
                subjectId: subject.id,
                subjectName: subject.name,
                earnedScore: Math.round(earnedScore * 100) / 100,
                maxScore: Math.round(maxScore * 100) / 100,
                passed: earnedScore >= 40,
            };
        });

        const average =
            subjectResults.reduce((sum, r) => sum + r.earnedScore, 0) /
            subjectResults.length;

        const passed = average >= 60 && subjectResults.every((r) => r.passed);

        const wrongQuestionIds = flat
            .filter((f, i) => answers[i] !== f.question.answer)
            .map((f) => f.question.id);

        const correctCount = flat.length - wrongQuestionIds.length;

        saveAttempt({
            examSetId: examSet!.id,
            examTitle: examSet!.title,
            date: new Date().toISOString(),
            subjectResults,
            average: Math.round(average * 100) / 100,
            passed,
            correctCount,
            totalCount: flat.length,
            durationSec: Math.round((Date.now() - startTime) / 1000),
            wrongQuestionIds,
        });

        router.push("/result");
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <p className="text-sm text-gray-500 mb-2">
                {current + 1} / {flat.length}
            </p>

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

            <h2 className="text-lg font-semibold mb-4">
                {question.number}. {question.text}
            </h2>

            <div className="space-y-2">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        className={`w-full text-left p-3 rounded border ${
                            answers[current] === idx
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                        }`}
                    >
                        {opt}
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
                        제출
                    </button>
                )}
            </div>
        </div>
    );
}