"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { EventCard } from "@/features/events/components/EventCard";
import { SearchBox } from "@/features/events/components/SearchBox";
import { getEvents } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";

type CategoryFilter = "All" | string;

export function AllEventsPage() {
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryOverride, setCategoryOverride] = useState<string | null>(null);

    useEffect(() => {
        getEvents()
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events:", err);
                setLoading(false);
            });
    }, []);

    const categories = useMemo(() => {
        const cats = new Set<string>(events.map(e => e.category));
        return ["All", ...cats];
    }, [events]);

    const activeCategory: CategoryFilter =
        categoryOverride ?? searchParams.get("category") ?? "All";

    const filteredEvents = useMemo(() => {
        if (activeCategory === "All") {
            return events;
        }
        return events.filter((event) => event.category === activeCategory);
    }, [activeCategory, events]);

    return (
        <main>
            <section className="mx-auto max-w-6xl px-5 pt-8 md:px-10">
                <h1 className="font-[var(--font-bebas)] text-[38px] tracking-wide text-[var(--ink)]">
                    All Events
                </h1>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {loading ? "Loading..." : `${filteredEvents.length} events currently available`}
                </p>
            </section>

            <section className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 pt-5 md:px-10">
                <SearchBox className="w-full md:w-[360px]" />

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setCategoryOverride(category)}
                            className={cn(
                                "rounded-full border px-4 py-2 text-sm transition",
                                activeCategory === category
                                    ? "border-[var(--gold)] bg-[var(--gold)] font-semibold text-[#3a2a08]"
                                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <select className="ml-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none">
                    <option>Nearest date</option>
                    <option>Price: low to high</option>
                    <option>Most popular</option>
                </select>
            </section>

            <section className="mx-auto max-w-6xl px-5 pt-6 md:px-10">
                {loading ? (
                    <p className="text-center text-[var(--muted)]">Loading events...</p>
                ) : (
                    <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                title={event.title}
                                venue={event.venue}
                                startDate={event.startDate}
                                imageUrl={event.imageUrl}
                                hot={event.hot}
                                className="min-w-0"
                            />
                        ))}
                    </div>
                )}
            </section>

            <div className="mx-auto flex max-w-6xl justify-center gap-2 px-5 py-8 md:px-10">
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={cn(
                            "h-9 w-9 rounded-lg border text-sm",
                            page === 1
                                ? "border-[var(--crimson)] bg-[var(--crimson)] text-[var(--ink)]"
                                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                        )}
                    >
                        {page}
                    </button>
                ))}

                <button className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--muted)]">
                    ...
                </button>

                <button className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--muted)]">
                    16
                </button>
            </div>
        </main>
    );
}