"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTicketByCode } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { CustomerBookingDto } from "@/features/booking/api/bookingApi";

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
    const { accessToken } = useAuth();
    const [booking, setBooking] = useState<CustomerBookingDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTicket = async () => {
            try {
                if (!accessToken) {
                    setLoading(false);
                    return;
                }

                const data = await getTicketByCode(ticketCode, accessToken);
                setBooking(data);
            } catch (err) {
                console.error("Failed to fetch ticket:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTicket();
    }, [ticketCode, accessToken]);

    if (loading) {
        return (
            <main className="mx-auto max-w-[420px] px-6 pb-16 pt-8">
                <Link href="/tickets" className="mb-4 block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                    ← Back to My Tickets
                </Link>
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--muted)]">Loading ticket...</p>
                </div>
            </main>
        );
    }

    if (!booking) {
        return (
            <main className="mx-auto max-w-[420px] px-6 pb-16 pt-8">
                <Link href="/tickets" className="mb-4 block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                    ← Back to My Tickets
                </Link>
                <div className="text-center py-10">
                    <p className="text-[var(--muted)]">Ticket not found</p>
                </div>
            </main>
        );
    }

    const eventDate = new Date(booking.event.startDate);
    const eventMeta = `${eventDate.toLocaleDateString()} · ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${booking.event.venue}`;

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
                    <Image
                        src={booking.event.imageUrl}
                        alt={booking.event.title}
                        fill
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--surface),transparent_70%)]" />
                </div>

                <div className="px-[22px] pb-[22px] text-center">
                    <h1 className="relative -mt-4 font-[var(--font-bebas)] text-2xl tracking-wide text-[var(--ink)]">
                        {booking.event.title}
                    </h1>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {eventMeta}
                    </p>

                    <div className="my-[18px] flex justify-center gap-7 border-y border-dashed border-[var(--border)] py-3.5">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Section
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {booking.seat.section}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Row
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {booking.seat.rowLabel}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                                Seat
                            </div>
                            <div className="mt-0.5 font-[var(--font-bebas)] text-[22px] text-[var(--gold)]">
                                {booking.seat.seatNumber}
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
                            {booking.bookingReference}
                        </span>
                    </div>

                    <span className="mt-3.5 inline-block rounded-md border border-[var(--gold)] bg-[rgba(245,184,65,0.15)] px-3 py-1 text-[10px] font-bold tracking-[0.05em] text-[var(--gold)]">
                        {booking.status}
                    </span>
                </div>
            </article>
        </main>
    );
}