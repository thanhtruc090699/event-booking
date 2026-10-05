"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SearchBox } from "@/features/events/components/SearchBox";
import { getEvents } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";

export function SearchSection() {
    const [events, setEvents] = useState<EventDto[]>([]);

    useEffect(() => {
        getEvents()
            .then(setEvents)
            .catch(err => console.error("Failed to load categories:", err));
    }, []);

    const categories = useMemo(() => {
        const cats = new Set<string>(events.map(e => e.category));
        return ["All", ...cats];
    }, [events]);

    return (
        <section className="mx-auto max-w-6xl px-5 pt-9 md:px-10">
            <h2 className="mb-4 font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                Explore Events
            </h2>

            <SearchBox />

            <div className="mt-5 flex flex-wrap gap-3">
                {categories.map((category) => (
                    <Link
                        key={category}
                        href={category === "All" ? "/events" : `/events?category=${encodeURIComponent(category)}`}
                        className={cn(
                            "rounded-full border px-5 py-2 text-sm transition",
                            "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
                        )}
                    >
                        {category}
                    </Link>
                ))}
            </div>
        </section>
    );
}