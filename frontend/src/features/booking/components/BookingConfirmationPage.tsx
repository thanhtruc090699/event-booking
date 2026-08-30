import Link from "next/link";
import { PriceSummary } from "@/features/booking/components/PriceSummary";
import { SeatLine } from "@/features/booking/components/SeatLine";
import { mockBooking } from "@/features/booking/data/mockBooking";

export function BookingConfirmationPage() {
    return (
        <main className="mx-auto max-w-[480px] px-6 pb-16 pt-10">
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)] bg-[rgba(245,184,65,0.12)] text-3xl text-[var(--gold)]">
                    ✓
                </div>

                <h1 className="font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                    Booking confirmed
                </h1>

                <p className="mt-1.5 text-sm text-[var(--muted)]">
                    You&apos;re going to
                </p>
            </div>

            <div className="relative mb-[18px] h-[150px] overflow-hidden rounded-[14px]">
                <img
                    src={mockBooking.event.imageUrl}
                    alt={mockBooking.event.title}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.9),transparent_70%)]" />

                <div className="absolute bottom-3 left-3.5">
                    <h2 className="font-[var(--font-bebas)] text-[22px] tracking-wide text-[var(--ink)]">
                        {mockBooking.event.title}
                    </h2>

                    <p className="text-xs text-[var(--muted)]">
                        {mockBooking.event.date} · {mockBooking.event.time} · {mockBooking.event.venue}
                    </p>
                </div>
            </div>

            <div className="mb-[18px] rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-3.5 text-center">
                <div className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                    Booking reference
                </div>

                <div className="mt-1 font-[var(--font-mono)] text-lg text-[var(--gold)]">
                    {mockBooking.bookingReference}
                </div>
            </div>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Your tickets
                </h2>

                {mockBooking.selectedSeats.map((seat) => (
                    <SeatLine
                        key={`${seat.section}-${seat.row}-${seat.seat}`}
                        section={seat.section}
                        row={seat.row}
                        seat={seat.seat}
                    />
                ))}
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <PriceSummary />
            </section>

            <div className="mt-5 flex flex-col gap-2.5">
                <Link
                    href={`/tickets/${mockBooking.ticketCode}`}
                    className="block rounded-lg bg-[var(--crimson)] px-5 py-3.5 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                >
                    View Tickets
                </Link>

                <Link
                    href="/tickets"
                    className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-hover)]"
                >
                    View My Bookings
                </Link>
            </div>

            <Link
                href="/"
                className="mt-4 block text-center text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to Events
            </Link>
        </main>
    );
}