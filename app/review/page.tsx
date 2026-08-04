import { Suspense } from "react";
import ReviewContent from "./ReviewContent";

export default function ReviewPage() {
    return (
        <Suspense fallback={<div className="p-6">기록을 불러오는 중...</div>}>
            <ReviewContent />
        </Suspense>
    );
}