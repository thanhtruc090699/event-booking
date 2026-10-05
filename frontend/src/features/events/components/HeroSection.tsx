"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getEvents, type EventDto } from "@/features/events/api/eventsApi";

export function HeroSection() {
    const [featuredEvent, setFeaturedEvent] = useState<EventDto | null>(null);

    useEffect(() => {
        getEvents()
            .then(events => {
                if (events && events.length > 0) {
                    const hotEvent = events.find(e => e.hot) || events[0];
                    setFeaturedEvent(hotEvent);
                }
            })
            .catch(err => console.error("Failed to fetch featured event:", err));
    }, []);

    if (!featuredEvent) {
        return (
            <section className="flex min-h-[440px] items-center justify-center bg-[var(--void)] px-10 md:min-h-[520px] lg:min-h-[560px]">
                <p className="text-[var(--muted)]">Loading...</p>
            </section>
        );
    }

    const eventDate = new Date(featuredEvent.startDate);
    const dateTimeLabel = `${eventDate.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${eventDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <section 
            className="flex min-h-[440px] items-end bg-cover bg-center px-10 pb-10 md:min-h-[520px] lg:min-h-[560px]"
            style={{
                backgroundImage: `linear-gradient(to top, var(--void) 0%, transparent 100%), url(${featuredEvent.imageUrl})`
            }}
        >
            <div className="max-w-2xl">
                <p className="mb-2 font-[var(--font-mono)] text-xs tracking-[0.3em] text-[var(--gold)]">
                    FEATURED EVENT
                </p>

                <h1 className="font-[var(--font-bebas)] text-6xl leading-none tracking-wide text-[var(--ink)]">
                    {featuredEvent.title}
                </h1>

                <p className="mt-4 text-sm text-[var(--muted)]">
                    {featuredEvent.venue}, {featuredEvent.city} · {dateTimeLabel}
                </p>

                <div className="mt-6 flex gap-3">
                    <Link href={`/events/${featuredEvent.id}`}>
                        <Button>
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}