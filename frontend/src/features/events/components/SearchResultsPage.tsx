"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { EventCard } from "@/features/events/components/EventCard";
import { SearchBox } from "@/features/events/components/SearchBox";
import { getEvents } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";

type SearchResultsPageProps = {
    initialQuery: string;
};

export function SearchResultsPage({ initialQuery }: SearchResultsPageProps) {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const normalizedQuery = initialQuery.trim().toLowerCase();

    useEffect(() => {
        getEvents()
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const categories = useMemo(() => {
        const cats = new Set<string>(events.map(e => e.category));
        return ["All", ...cats];
    }, [events]);

    const results = useMemo(() => {
        return events.filter((event) => {
            const matchesQuery =
                !normalizedQuery ||
                event.title.toLowerCase().includes(normalizedQuery) ||
                event.venue.toLowerCase().includes(normalizedQuery) ||
                event.city.toLowerCase().includes(normalizedQuery) ||
                event.category.toLowerCase().includes(normalizedQuery);

            const matchesCategory =
                activeCategory === "All" ||
                event.category === activeCategory;

            return matchesQuery && matchesCategory;
        });
    }, [normalizedQuery, activeCategory, events]);

    return (
        <main>
            <section className="mx-auto max-w-6xl px-5 pt-8 md:px-10">
                <p className="mb-2 text-xs text-[var(--muted)]">
                    Events / Search results
                </p>

                <h1 className="font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                    Results for{" "}
                    <span className="text-[var(--gold)]">
                        &quot;{initialQuery || "all"}&quot;
                    </span>
                </h1>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {loading ? "Loading..." : `${results.length} events found`}
                </p>
            </section>

            <section className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 pt-5 md:px-10">
                <SearchBox
                    initialQuery={initialQuery}
                    className="w-full md:w-[360px]"
                />

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
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
                    <option>Most relevant</option>
                    <option>Nearest date</option>
                    <option>Price: low to high</option>
                </select>
            </section>

            {loading ? (
                <section className="mx-auto max-w-6xl px-5 py-16 text-center md:px-10">
                    <p className="text-[var(--muted)]">Loading...</p>
                </section>
            ) : results.length > 0 ? (
                <section className="mx-auto max-w-6xl px-5 pt-6 md:px-10">
                    <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
                        {results.map((event) => (
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
                </section>
            ) : (
                <section className="mx-auto max-w-6xl px-5 py-16 text-center md:px-10">
                    <div className="mb-4 text-4xl opacity-60">⌕</div>

                    <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide text-[var(--ink)]">
                        No results found for &quot;{initialQuery}&quot;
                    </h2>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Try another keyword or select one of the categories below.
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {categories
                            .filter((category) => category !== "All")
                            .map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
                                >
                                    {category}
                                </button>
                            ))}
                    </div>
                </section>
            )}
        </main>
    );
}