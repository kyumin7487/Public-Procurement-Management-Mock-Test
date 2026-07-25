import Link from "next/link";
import { getSubjectBanks } from "@/lib/questionBank";

export default function HomePage() {
    const subjects = getSubjectBanks();
    const totalRequired = subjects.reduce((sum, s) => sum + s.requiredCount, 0);

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1">공공조달관리사 모의고사</h1>
            <p className="text-sm text-gray-500 mb-6">
                시험시간 2시간 · 총 {totalRequired}문항(3과목) · 과목당 40점 이상 &
                평균 60점 이상 합격
            </p>

            <div className="space-y-2 mb-6">
                {subjects.map((s) => (
                    <div
                        key={s.id}
                        className="flex justify-between items-center p-3 rounded border border-gray-200 text-sm"
                    >
                        <span>{s.name}</span>
                        <span
                            className={
                                s.questions.length < s.requiredCount
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }
                        >
              {s.questions.length < s.requiredCount
                  ? `문제 준비 중 (${s.questions.length}/${s.requiredCount})`
                  : `${s.requiredCount}문항`}
            </span>
                    </div>
                ))}
            </div>

            <Link
                href="/exam"
                className="block text-center p-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
                새 모의고사 시작 (문제 랜덤 출제)
            </Link>

            <div className="flex gap-4 mt-6 text-sm">
                <Link href="/stats" className="text-blue-600 underline">
                    응시 기록 / 통계
                </Link>
                <Link href="/bank" className="text-blue-600 underline">
                    전체 문제 풀이(정답+해설) 보기
                </Link>
            </div>
        </div>
    );
}
