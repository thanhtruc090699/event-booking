"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EventSummaryCard } from "@/features/booking/components/EventSummaryCard";
import { PriceSummary } from "@/features/booking/components/PriceSummary";
import { SeatLine } from "@/features/booking/components/SeatLine";
import { TimerBanner } from "@/features/booking/components/TimerBanner";
import { getReservation } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ReservationSummaryDto } from "@/features/booking/api/bookingApi";

export function CheckoutPage() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId");
    const { accessToken } = useAuth();
    const [reservation, setReservation] = useState<ReservationSummaryDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Nếu không có reservationId hoặc accessToken, dừng luôn
        if (!reservationId || !accessToken) {
            return;
        }
        
        getReservation(reservationId, accessToken)
            .then(data => {
                setReservation(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch reservation:", err);
                setLoading(false);
            });
    }, [reservationId, accessToken]);

    // Chưa có reservationId hoặc user chưa login
    if (!reservationId) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="text-center">
                    <p className="text-[var(--muted)]">No reservation selected</p>
                    <Link href="/" className="mt-4 inline-block text-[var(--gold)]">
                        Browse Events →
                    </Link>
                </div>
            </main>
        );
    }
    
    if (!accessToken) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="text-center">
                    <p className="text-[var(--muted)]">Please login to continue</p>
                    <Link href={`/login?redirect=/booking/checkout?reservationId=${reservationId}`} className="mt-4 inline-block text-[var(--gold)]">
                        Login →
                    </Link>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--muted)]">Loading reservation...</p>
                </div>
            </main>
        );
    }

    if (!reservation) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="text-center">
                    <p className="text-[var(--muted)]">Reservation not found or expired</p>
                    <Link href="/" className="mt-4 inline-block text-[var(--gold)]">
                        Browse Events →
                    </Link>
                </div>
            </main>
        );
    }

    const eventDate = new Date(reservation.event.startDate);
    const eventMeta = `${eventDate.toLocaleDateString()} · ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${reservation.event.venue}`;

    return (
        <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
            <Link
                href={`/events/${reservation.event.id}#seat-selection`}
                className="mb-2 block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to seat selection
            </Link>

            <h1 className="mb-[18px] font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                Checkout
            </h1>

            <EventSummaryCard
                imageUrl={reservation.event.imageUrl}
                title={reservation.event.title}
                meta={eventMeta}
            />

            <TimerBanner
                label="Your seats are reserved for"
                expiresAt={reservation.expiresAt}
                note="Complete your booking before the timer expires."
            />

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <div className="mb-3.5 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Your seats
                    </h2>

                    <Link
                        href={`/events/${reservation.event.id}#seat-selection`}
                        className="text-xs font-semibold text-[var(--gold)]"
                    >
                        Change seats
                    </Link>
                </div>

                {reservation.selectedSeats.map((seat) => (
                    <SeatLine
                        key={seat.id.toString()}
                        section={seat.section}
                        row={seat.rowLabel}
                        seat={seat.seatNumber}
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

                <PriceSummary seats={reservation.selectedSeats} />
            </section>

            <section className="mb-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Payment method
                </h2>

                <div className="flex items-center gap-3 rounded-lg border border-[var(--gold)] bg-[var(--gold)]/10 p-3">
                    <span className="relative h-4 w-4 rounded-full border-2 border-[var(--gold)]">
                        <span className="absolute inset-[2px] rounded-full bg-[var(--gold)]" />
                    </span>
                    <span className="text-sm font-medium text-[var(--ink)]">PayPal</span>
                </div>
            </section>

            <div className="sticky bottom-0 bg-[linear-gradient(to_top,var(--void)_60%,transparent)] py-5">
                <Link
                    href={`/booking/payment?reservationId=${reservationId}`}
                    className="block w-full rounded-lg bg-[var(--crimson)] px-5 py-4 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                >
                    Continue to Payment
                </Link>
            </div>
        </main>
    );
}
