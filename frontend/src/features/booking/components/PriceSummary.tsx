import type { ReservedSeatDto } from "@/features/booking/api/bookingApi";

type PriceSummaryProps = {
    seats?: ReservedSeatDto[];
};

const SERVICE_FEE = 4.0;

export function PriceSummary({ seats }: PriceSummaryProps) {
    if (!seats || seats.length === 0) {
        return null;
    }
    
    const ticketCount = seats.length;
    const ticketTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    const orderTotal = ticketTotal + SERVICE_FEE;

    return (
        <div>
            <div className="flex justify-between py-1.5 text-sm text-[var(--muted)]">
                <span>{ticketCount} × Tickets</span>
                <span>€{ticketTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1.5 text-sm text-[var(--muted)]">
                <span>Service fee</span>
                <span>€{SERVICE_FEE.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3 text-base font-bold text-[var(--ink)]">
                <span>Total</span>
                <span className="font-[var(--font-mono)] text-[var(--gold)]">
                    €{orderTotal.toFixed(2)}
                </span>
            </div>
        </div>
    );
}
