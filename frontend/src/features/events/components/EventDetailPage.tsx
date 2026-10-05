"use client";

import { useEffect, useState } from "react";
import { getEventById } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";
import { SeatMap } from "@/features/booking/components/SeatMap";

type EventDetailPageProps = {
    eventId: string;
};

function formatDateTime(isoDate: string): { date: string; time: string } {
    const date = new Date(isoDate);
    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return { date: dateStr, time: timeStr };
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
    const [event, setEvent] = useState<EventDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEventById(eventId)
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch event:", err);
                setLoading(false);
            });
    }, [eventId]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-[var(--muted)]">Loading event...</p>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-[var(--muted)]">Event not found</p>
            </main>
        );
    }

    const { date, time } = formatDateTime(event.startDate);

    return (
        <main>
            <section className="relative min-h-[520px] overflow-hidden md:min-h-[580px] lg:min-h-[620px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${event.imageUrl})`,
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[rgba(10,10,12,0.72)] to-[rgba(10,10,12,0.15)]" />

                <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-14 pt-56 md:px-10 md:pt-64 lg:grid-cols-[1fr_340px] lg:items-end">
                    <div>
                        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
                            {event.category}
                        </span>

                        <h1 className="mt-5 font-[var(--font-bebas)] text-5xl leading-none tracking-wide text-[var(--ink)] md:text-6xl">
                            {event.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
                            <span>📍 {event.venue}</span>
                            <span>🗓 {date}</span>
                            <span>🕖 {time}</span>
                        </div>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                            {event.description}
                        </p>

                        <p className="mt-4 font-[var(--font-mono)] text-xs text-[var(--muted)]">
                            Event ID: {eventId}
                        </p>
                    </div>

                    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                        <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                            Tickets from
                        </p>

                        <p className="mt-2 font-[var(--font-bebas)] text-5xl tracking-wide text-[var(--ink)]">
                            {event.startingPrice.toFixed(2)} €
                        </p>

                        <p className="mt-3 text-sm font-medium text-[var(--gold)]">
                            ● {event.availableSeats} seats available
                        </p>

                        <a
                            href="#seat-selection"
                            className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--gold)]"
                        >
                            View Seat Map
                        </a>
                    </aside>
                </div>
            </section>

            <SeatMap eventId={eventId}/>
        </main>
    );
}