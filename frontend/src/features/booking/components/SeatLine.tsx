import { formatEuro } from "@/features/booking/data/mockBooking";

type SeatLineProps = {
    section: string;
    row: string;
    seat: string;
    price?: number;
};

export function SeatLine({
                             section,
                             row,
                             seat,
                             price,
                         }: SeatLineProps) {
    return (
        <div className="flex justify-between border-b border-[var(--border)] py-2 text-sm last:border-b-0">
            <div className="text-[var(--ink)]">
                Section {section} · Row {row}
                <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    Seat {seat}
                </span>
            </div>

            {typeof price === "number" && (
                <div className="font-[var(--font-mono)] text-[var(--ink)]">
                    {formatEuro(price)}
                </div>
            )}
        </div>
    );
}