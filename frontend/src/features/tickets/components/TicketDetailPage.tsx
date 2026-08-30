import Link from "next/link";
import { mockBooking } from "@/features/booking/data/mockBooking";

type TicketDetailPageProps = {
    ticketCode: string;
};

const qrPattern = [
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 1, 0, 0, 0,
    1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 0, 1,
];

export function TicketDetailPage({ ticketCode }: TicketDetailPageProps) {
    const primarySeat = mockBooking.selectedSeats[0];

    return (
        <main className="mx-auto max-w-[420px] px-6 pb-16 pt-8">
            <Link
                href="/tickets"
                className="mb-4 block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to My Tickets
            </Link>

            <article className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)]">
                <div className="relative h-[120px]">
                    <img
                        src={mockBooking.event.imageUrl}
                        alt={mockBooking.event.title}
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--surface),transparent_70%)]" />
                </div>

                <div className="px-[22px] pb-[22px] text-center">
                    <h1 className="relative -mt-4 font-[var(--font-bebas)] text-2xl tracking-wide text-[var(--ink)]">
                        {mockBooking.event.title}
                    </h1>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {mockBooking.event.date} · {mockBooking.event.time} · {mockBooking.event.venue}
                    </p>

                    <div className="my-[18px] flex justify-center gap-7 border-y border-dashed border-[var(--border)] py-3.5">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Section
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {primarySeat.section}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Row
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {primarySeat.row}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Seat
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {primarySeat.seat}
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto my-4 grid h-[150px] w-[150px] grid-cols-7 grid-rows-7 gap-[3px] rounded-[10px] bg-white p-2.5">
                        {qrPattern.map((cell, index) => (
                            <span
                                key={index}
                                className={cell ? "rounded-sm bg-[var(--void)]" : "bg-transparent"}
                            />
                        ))}
                    </div>

                    <div className="mt-1.5 text-xs text-[var(--muted)]">
                        Ticket ID
                        <span className="mt-0.5 block font-[var(--font-mono)] text-[var(--ink)]">
                            {ticketCode}
                        </span>
                    </div>

                    <div className="mt-1.5 text-xs text-[var(--muted)]">
                        Booking reference
                        <span className="mt-0.5 block font-[var(--font-mono)] text-[var(--ink)]">
                            {mockBooking.bookingReference}
                        </span>
                    </div>

                    <span className="mt-3.5 inline-block rounded-md border border-[var(--gold)] bg-[rgba(245,184,65,0.15)] px-3 py-1 text-[10px] font-bold tracking-[0.05em] text-[var(--gold)]">
                        UPCOMING
                    </span>
                </div>
            </article>
        </main>
    );
}