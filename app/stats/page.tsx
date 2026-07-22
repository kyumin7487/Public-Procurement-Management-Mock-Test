"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAttempts, AttemptRecord } from "@/lib/storage";

export default function StatsPage() {
    const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

    useEffect(() => {
        setAttempts(getAttempts());
    }, []);

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">응시 기록</h1>

            {attempts.length === 0 ? (
                <p className="text-gray-500">아직 응시 기록이 없습니다.</p>
            ) : (
                <div className="space-y-4">
                    {attempts
                        .slice()
                        .reverse()
                        .map((a, i) => (
                            <div key={i} className="p-4 rounded border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold">{a.examTitle}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(a.date).toLocaleString("ko-KR")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold ${
                                                a.passed ? "text-blue-600" : "text-red-600"
                                            }`}
                                        >
                                            평균 {a.average}점 · {a.passed ? "합격" : "불합격"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            정답 {a.correctCount}/{a.totalCount}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {a.subjectResults.map((r) => (
                                        <span
                                            key={r.subjectId}
                                            className={`text-xs px-2 py-1 rounded ${
                                                r.passed
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                      {r.subjectName} {r.earnedScore}점
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <Link href="/" className="inline-block mt-6 text-sm text-blue-600 underline">
                홈으로
            </Link>
        </div>
    );
}