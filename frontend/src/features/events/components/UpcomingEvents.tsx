"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/features/events/components/EventCard";
import { getEvents } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";
import Link from "next/link";

export function UpcomingEventsSection() {
    const [events, setEvents] = useState<EventDto[]>([]);

    useEffect(() => {
        getEvents().then(data => {
            const now = new Date();
            const upcoming = data.filter(e => new Date(e.startDate) > now);
            setEvents(upcoming.slice(0, 5));
        }).catch(console.error);
    }, []);

    return (
        <section className="mx-auto max-w-6xl px-5 pt-8 md:px-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                    Upcoming Near You
                </h2>

                <Link
                    href="/events"
                    className="text-xs font-medium text-[var(--muted)] transition hover:text-[var(--ink)]"
                >
                    View all →
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        venue={event.venue}
                        startDate={event.startDate}
                        imageUrl={event.imageUrl}
                        hot={event.hot}
                    />
                ))}
            </div>
        </section>
    );
}