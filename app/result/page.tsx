import { Suspense } from "react";
import ResultContent from "./ResultContent";

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="p-6">불러오는 중...</div>}>
            <ResultContent />
        </Suspense>
    );
}