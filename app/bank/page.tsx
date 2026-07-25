"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getSubjectBanks } from "@/lib/questionBank";

export default function BankPage() {
    const subjects = getSubjectBanks();
    const [subjectFilter, setSubjectFilter] = useState<string>("all");

    const filtered = useMemo(() => {
        if (subjectFilter === "all") return subjects;
        return subjects.filter((s) => s.id === subjectFilter);
    }, [subjects, subjectFilter]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="no-print flex justify-between items-center mb-4">
                <Link href="/" className="text-sm text-blue-600 underline">
                    ← 홈으로
                </Link>
                <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
                >
                    PDF로 저장 (인쇄 → PDF로 저장)
                </button>
            </div>

            <h1 className="text-xl font-bold mb-1">전체 문제 풀이 (정답 + 해설)</h1>
            <p className="text-sm text-gray-500 mb-4">
                문제은행에 등록된 전체 문항을 정답, 해설과 함께 볼 수 있습니다.
            </p>

            <div className="no-print flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setSubjectFilter("all")}
                    className={`px-3 py-1.5 rounded text-sm border ${
                        subjectFilter === "all"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300"
                    }`}
                >
                    전체
                </button>
                {subjects.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSubjectFilter(s.id)}
                        className={`px-3 py-1.5 rounded text-sm border ${
                            subjectFilter === s.id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300"
                        }`}
                    >
                        {s.name} ({s.questions.length})
                    </button>
                ))}
            </div>

            {filtered.map((subject) => (
                <div key={subject.id} className="mb-8">
                    <h2 className="font-bold text-lg mb-3 border-b-2 border-gray-800 pb-1">
                        {subject.name}
                    </h2>
                    <div className="space-y-5">
                        {subject.questions.map((q) => (
                            <div key={q.id} className="break-inside-avoid">
                                <div className="text-xs text-gray-500 mb-1">
                                    출제기준 · {q.category.main} / {q.category.sub} / {q.category.detail}
                                </div>
                                <p className="font-semibold mb-1">
                                    {q.number}. {q.text}
                                </p>
                                <ul className="mb-1">
                                    {q.options.map((opt, oi) => (
                                        <li
                                            key={oi}
                                            className={`text-sm ${
                                                oi === q.answer ? "text-blue-700 font-semibold" : ""
                                            }`}
                                        >
                                            {oi + 1}. {opt} {oi === q.answer ? "(정답)" : ""}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                                    해설: {q.explanation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

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
