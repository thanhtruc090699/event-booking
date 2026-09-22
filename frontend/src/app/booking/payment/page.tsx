import { Suspense } from "react";
import { PaymentPage } from "@/features/booking/components/PaymentPage";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-[var(--muted)]">Loading...</p>
            </div>
        }>
            <PaymentPage />
        </Suspense>
    );
}