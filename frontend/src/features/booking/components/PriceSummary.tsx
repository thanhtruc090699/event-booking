import {
    formatEuro,
    getOrderTotal,
    getTicketsTotal,
    mockBooking,
} from "@/features/booking/data/mockBooking";

export function PriceSummary() {
    const ticketCount = mockBooking.selectedSeats.length;
    const ticketTotal = getTicketsTotal();
    const orderTotal = getOrderTotal();

    return (
        <div>
            <div className="flex justify-between py-1.5 text-sm text-[var(--muted)]">
                <span>{ticketCount} × Tickets</span>
                <span>{formatEuro(ticketTotal)}</span>
            </div>

            <div className="flex justify-between py-1.5 text-sm text-[var(--muted)]">
                <span>Service fee</span>
                <span>{formatEuro(mockBooking.serviceFee)}</span>
            </div>

            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3 text-base font-bold text-[var(--ink)]">
                <span>Total</span>
                <span className="font-[var(--font-mono)] text-[var(--gold)]">
                    {formatEuro(orderTotal)}
                </span>
            </div>
        </div>
    );
}