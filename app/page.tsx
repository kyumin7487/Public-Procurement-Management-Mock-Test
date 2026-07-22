import Link from "next/link";
import { getExamSets, getTotalQuestionCount } from "@/lib/questions";

export default function HomePage() {
    const examSets = getExamSets();

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">공공조달관리사 모의고사</h1>

            <div className="space-y-3">
                {examSets.map((set) => (
                    <Link
                        key={set.id}
                        href={`/exam?id=${set.id}`}
                        className="block p-4 rounded border border-gray-200 hover:border-blue-400 transition"
                    >
                        <p className="font-semibold">{set.title}</p>
                        <p className="text-sm text-gray-500">
                            총 {getTotalQuestionCount(set)}문항 (3과목)
                        </p>
                    </Link>
                ))}
            </div>

            <Link href="/stats" className="inline-block mt-6 text-sm text-blue-600 underline">
                회차별 통계 보기
            </Link>
        </div>
    );
}