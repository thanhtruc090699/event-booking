import { Suspense } from "react";
import { CheckoutPage } from "@/features/booking/components/CheckoutPage";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-[var(--muted)]">Loading...</p>
            </div>
        }>
            <CheckoutPage />
        </Suspense>
    );
}