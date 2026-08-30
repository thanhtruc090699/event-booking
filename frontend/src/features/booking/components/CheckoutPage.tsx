import Link from "next/link";
import { EventSummaryCard } from "@/features/booking/components/EventSummaryCard";
import { PaymentOption } from "@/features/booking/components/PaymentOption";
import { PriceSummary } from "@/features/booking/components/PriceSummary";
import { SeatLine } from "@/features/booking/components/SeatLine";
import { TimerBanner } from "@/features/booking/components/TimerBanner";
import { mockBooking } from "@/features/booking/data/mockBooking";

export function CheckoutPage() {
    const eventMeta = `${mockBooking.event.date} · ${mockBooking.event.time} · ${mockBooking.event.venue}`;

    return (
        <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
            <Link
                href="/events/1#seat-selection"
                className="mb-2 block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to seat selection
            </Link>

            <h1 className="mb-[18px] font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                Checkout
            </h1>

            <EventSummaryCard
                imageUrl={mockBooking.event.summaryImageUrl}
                title={mockBooking.event.title}
                meta={eventMeta}
            />

            <TimerBanner
                label="Your seats are reserved for"
                time="09:42"
                note="Complete your booking before the timer expires."
            />

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <div className="mb-3.5 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Your seats
                    </h2>

                    <Link
                        href="/events/1#seat-selection"
                        className="text-xs font-semibold text-[var(--gold)]"
                    >
                        Change seats
                    </Link>
                </div>

                {mockBooking.selectedSeats.map((seat) => (
                    <SeatLine
                        key={`${seat.section}-${seat.row}-${seat.seat}`}
                        section={seat.section}
                        row={seat.row}
                        seat={seat.seat}
                        price={seat.price}
                    />
                ))}
            </section>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Contact information
                </h2>

                <div className="mb-3.5">
                    <label className="mb-1.5 block text-xs text-[var(--muted)]">
                        Full name
                    </label>
                    <input
                        defaultValue="Max Mustermann"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs text-[var(--muted)]">
                        Email
                    </label>
                    <input
                        defaultValue="max@example.com"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                    />
                </div>
            </section>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Order summary
                </h2>

                <PriceSummary />
            </section>

            <section className="mb-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Payment method
                </h2>

                <PaymentOption label="Credit / Debit Card" selected />
                <PaymentOption label="PayPal" />
                <PaymentOption label="Google Pay" />
            </section>

            <div className="sticky bottom-0 bg-[linear-gradient(to_top,var(--void)_60%,transparent)] py-5">
                <Link
                    href="/booking/payment"
                    className="block w-full rounded-lg bg-[var(--crimson)] px-5 py-4 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                >
                    Continue to Payment
                </Link>
            </div>
        </main>
    );
}