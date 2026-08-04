"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAttemptById } from "@/lib/storage";
import { AttemptRecord } from "@/lib/types";

export default function ReviewContent() {
    const params = useSearchParams();
    const id = params.get("id") ?? "";

    const [attempt, setAttempt] = useState<AttemptRecord | null>(null);

    useEffect(() => {
        setAttempt(getAttemptById(id) ?? null);
    }, [id]);

    if (!attempt) {
        return <div className="p-6">기록을 불러오는 중...</div>;
    }

    const wrongItems = attempt.items.filter((i) => !i.correct);

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="no-print flex justify-between items-center mb-4">
                <Link
                    href={`/result?id=${attempt.id}`}
                    className="text-sm text-blue-600 underline"
                >
                    ← 결과로 돌아가기
                </Link>

                <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
                >
                    PDF로 저장 (인쇄 → PDF로 저장)
                </button>
            </div>

            <h1 className="text-xl font-bold mb-1">오답노트</h1>

            <p className="text-sm text-gray-500 mb-6">
                {attempt.examTitle} ·{" "}
                {new Date(attempt.date).toLocaleString("ko-KR")} · 틀린 문항{" "}
                {wrongItems.length}개 / 전체 {attempt.totalCount}개
            </p>

            {wrongItems.length === 0 ? (
                <p className="text-gray-500">
                    틀린 문제가 없습니다. 전 과목 만점입니다!
                </p>
            ) : (
                <div className="space-y-6">
                    {wrongItems.map((item, idx) => (
                        <div
                            key={item.question.id}
                            className="border-b border-gray-200 pb-4 break-inside-avoid"
                        >
                            <div className="text-xs text-gray-500 mb-1">
                                {idx + 1}. [{item.subjectName}]{" "}
                                {item.question.category.main} /{" "}
                                {item.question.category.sub} /{" "}
                                {item.question.category.detail}
                            </div>

                            <p className="font-semibold mb-2">
                                {item.question.number}. {item.question.text}
                            </p>

                            <ul className="space-y-1 mb-2">
                                {item.question.options.map((opt, oi) => {
                                    const isUser = item.userAnswer === oi;
                                    const isAnswer = item.question.answer === oi;

                                    return (
                                        <li
                                            key={oi}
                                            className={`text-sm px-2 py-1 rounded ${
                                                isAnswer
                                                    ? "bg-blue-50 text-blue-700 font-semibold"
                                                    : isUser
                                                        ? "bg-red-50 text-red-600"
                                                        : ""
                                            }`}
                                        >
                                            {oi + 1}. {opt}
                                            {isAnswer ? " (정답)" : ""}
                                            {isUser && !isAnswer ? " (내가 쓴 답)" : ""}
                                        </li>
                                    );
                                })}
                            </ul>

                            {item.userAnswer === null && (
                                <p className="text-xs text-red-500 mb-1">
                                    ※ 미응답 문제입니다.
                                </p>
                            )}

                            <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                                해설: {item.question.explanation}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            color: black;
          }
        }
      `}</style>
        </div>
    );
}