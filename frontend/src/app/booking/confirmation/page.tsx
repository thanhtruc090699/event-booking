import { Suspense } from "react";
import { BookingConfirmationPage } from "@/features/booking/components/BookingConfirmationPage";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-[var(--muted)]">Loading...</p>
            </div>
        }>
            <BookingConfirmationPage />
        </Suspense>
    );
}