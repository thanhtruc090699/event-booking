"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PriceSummary } from "@/features/booking/components/PriceSummary";
import { SeatLine } from "@/features/booking/components/SeatLine";
import { getBooking } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { BookingDetailsDto } from "@/features/booking/api/bookingApi";

export function BookingConfirmationPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const { accessToken } = useAuth();
    const [booking, setBooking] = useState<BookingDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId || !accessToken) {
            setLoading(false);
            return;
        }

        getBooking(bookingId, accessToken)
            .then(data => {
                setBooking(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch booking:", err);
                setLoading(false);
            });
    }, [bookingId, accessToken]);

    if (loading) {
        return (
            <main className="mx-auto max-w-[480px] px-6 pb-16 pt-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--muted)]">Loading booking...</p>
                </div>
            </main>
        );
    }

    if (!booking) {
        return (
            <main className="mx-auto max-w-[480px] px-6 pb-16 pt-10">
                <div className="text-center">
                    <p className="text-[var(--muted)]">Booking not found</p>
                    <Link href="/" className="mt-4 inline-block text-[var(--gold)]">
                        Browse Events →
                    </Link>
                </div>
            </main>
        );
    }

    const eventDate = new Date(booking.reservation.event.startDate);
    const eventMeta = `${eventDate.toLocaleDateString()} · ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${booking.reservation.event.venue}`;

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
                    src={booking.reservation.event.imageUrl}
                    alt={booking.reservation.event.title}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.9),transparent_70%)]" />

                <div className="absolute bottom-3 left-3.5">
                    <h2 className="font-[var(--font-bebas)] text-[22px] tracking-wide text-[var(--ink)]">
                        {booking.reservation.event.title}
                    </h2>

                    <p className="text-xs text-[var(--muted)]">
                        {eventMeta}
                    </p>
                </div>
            </div>

            <div className="mb-[18px] rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-3.5 text-center">
                <div className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                    Booking reference
                </div>

                <div className="mt-1 font-[var(--font-mono)] text-lg text-[var(--gold)]">
                    {booking.bookingReference}
                </div>
            </div>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Your tickets
                </h2>

                {booking.reservation.selectedSeats.map((seat) => (
                    <SeatLine
                        key={seat.id.toString()}
                        section={seat.section}
                        row={seat.rowLabel}
                        seat={seat.seatNumber}
                        price={seat.price}
                    />
                ))}
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <PriceSummary seats={booking.reservation.selectedSeats} />
            </section>

            <div className="mt-5 flex flex-col gap-2.5">
                <Link
                    href={`/tickets/${booking.id}`}
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