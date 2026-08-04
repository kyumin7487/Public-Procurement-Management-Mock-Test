"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAttemptById } from "@/lib/storage";
import { AttemptRecord } from "@/lib/types";

function formatDuration(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}시간`);
    if (m > 0) parts.push(`${m}분`);
    parts.push(`${s}초`);

    return parts.join(" ");
}

export default function ResultContent() {
    const params = useSearchParams();
    const id = params.get("id") ?? "";

    const [attempt, setAttempt] = useState<AttemptRecord | null>(null);

    useEffect(() => {
        setAttempt(getAttemptById(id) ?? null);
    }, [id]);

    if (!attempt) {
        return <div className="p-6">기록을 불러오는 중...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1 text-center">채점 결과</h1>

            <p className="text-center text-gray-500 mb-1">
                {attempt.examTitle}
            </p>

            <p className="text-center text-xs text-gray-400 mb-6">
                소요시간 {formatDuration(attempt.durationSec)}
            </p>

            <div
                className={`text-center mb-6 p-4 rounded font-bold text-lg ${
                    attempt.passed
                        ? "bg-blue-50 text-blue-600"
                        : "bg-red-50 text-red-600"
                }`}
            >
                {attempt.passed ? "합격" : "불합격"} · 평균 {attempt.average}점
            </div>

            <div className="space-y-2 mb-6">
                {attempt.subjectResults.map((r) => (
                    <div
                        key={r.subjectId}
                        className="flex justify-between items-center p-3 rounded border border-gray-200"
                    >
                        <span>{r.subjectName}</span>

                        <span
                            className={`font-semibold ${
                                r.passed ? "text-blue-600" : "text-red-600"
                            }`}
                        >
              {r.earnedScore}점 ({r.correctCount}/{r.totalCount})
            </span>
                    </div>
                ))}
            </div>

            <p className="text-sm text-gray-500 text-center mb-6">
                전체 정답 {attempt.correctCount} / {attempt.totalCount}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
                <Link href="/" className="px-4 py-2 rounded bg-blue-600 text-white">
                    홈으로
                </Link>

                <Link
                    href={`/review?id=${attempt.id}`}
                    className="px-4 py-2 rounded border border-gray-300"
                >
                    오답노트 보기
                </Link>

                <Link
                    href="/stats"
                    className="px-4 py-2 rounded border border-gray-300"
                >
                    통계 보기
                </Link>
            </div>
        </div>
    );
}