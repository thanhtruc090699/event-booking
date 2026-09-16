"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { getEvents } from "@/features/events/api/eventsApi";
import type { EventDto } from "@/features/events/api/eventsApi";

type SearchBoxProps = {
    initialQuery?: string;
    className?: string;
};

const RECENT_SEARCHES_KEY = "stagepass_recent_searches";

function highlightMatch(text: string, query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return text;
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) {
        return text;
    }

    const before = text.slice(0, startIndex);
    const match = text.slice(startIndex, startIndex + trimmedQuery.length);
    const after = text.slice(startIndex + trimmedQuery.length);

    return (
        <>
            {before}
            <span className="font-bold text-[var(--gold)]">{match}</span>
            {after}
        </>
    );
}

function getRecentSearches() {
    if (typeof window === "undefined") {
        return [];
    }

    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);

    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw) as string[];
    } catch {
        return [];
    }
}

function saveRecentSearch(query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return;
    }

    const current = getRecentSearches();
    const next = [
        trimmedQuery,
        ...current.filter(
            (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
        ),
    ].slice(0, 5);

    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function SearchBox({ initialQuery = "", className }: SearchBoxProps) {
    const router = useRouter();

    const [events, setEvents] = useState<EventDto[]>([]);
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        setRecentSearches(getRecentSearches());
        getEvents()
            .then(data => setEvents(data))
            .catch(console.error);
    }, []);

    const matchingEvents = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (!value) {
            return [];
        }

        return events
            .filter((event) => {
                return (
                    event.title.toLowerCase().includes(value) ||
                    event.venue.toLowerCase().includes(value) ||
                    event.city.toLowerCase().includes(value) ||
                    event.category.toLowerCase().includes(value)
                );
            })
            .slice(0, 3);
    }, [query, events]);

    const shouldShowDropdown =
        isFocused && (query.trim().length > 0 || recentSearches.length > 0);

    function submitSearch(searchValue = query) {
        const trimmedQuery = searchValue.trim();

        if (!trimmedQuery) {
            return;
        }

        saveRecentSearch(trimmedQuery);
        router.push(`/events/search?q=${encodeURIComponent(trimmedQuery)}`);
    }

    function removeRecentSearch(searchValue: string) {
        const next = recentSearches.filter((item) => item !== searchValue);
        setRecentSearches(next);
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    }

    return (
        <div className={cn("relative max-w-[520px]", className)}>
            <div
                className={cn(
                    "flex h-12 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4",
                    isFocused &&
                    "border-[var(--gold)] shadow-[0_0_0_3px_rgba(245,184,65,0.12)]"
                )}
            >
                <span className="text-sm text-[var(--muted)]">⌕</span>

                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        window.setTimeout(() => setIsFocused(false), 150);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            submitSearch();
                        }
                    }}
                    placeholder="Search events, artists, venues..."
                    className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
                    >
                        ✕
                    </button>
                )}
            </div>

            {shouldShowDropdown && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                    {recentSearches.length > 0 && (
                        <div className="px-2 py-1">
                            <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                                Recent searches
                            </p>

                            {recentSearches.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        submitSearch(item);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[var(--ink)] hover:bg-[var(--surface-hover)]"
                                >
                                    <span className="text-[var(--muted)]">🕘</span>
                                    {item}

                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            removeRecentSearch(item);
                                        }}
                                        className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--ink)]"
                                    >
                                        ✕
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {recentSearches.length > 0 && matchingEvents.length > 0 && (
                        <div className="my-1 h-px bg-[var(--border)]" />
                    )}

                    {matchingEvents.length > 0 && (
                        <div className="px-2 py-1">
                            <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                                Matching events
                            </p>

                            {matchingEvents.map((event) => (
                                <button
                                    key={event.id}
                                    type="button"
                                    onMouseDown={(mouseEvent) => {
                                        mouseEvent.preventDefault();
                                        router.push(`/events/${event.id}`);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[var(--surface-hover)]"
                                >
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="h-10 w-10 rounded-md object-cover"
                                    />

                                    <div>
                                        <h4 className="text-sm font-semibold text-[var(--ink)]">
                                            {highlightMatch(event.title, query)}
                                        </h4>

                                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                                            {event.venue} · {new Date(event.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {query.trim() && (
                        <button
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                submitSearch();
                            }}
                            className="mt-1 w-full border-t border-[var(--border)] px-2 py-3 text-center text-xs font-semibold text-[var(--gold)]"
                        >
                            Press Enter to view all results for &quot;{query.trim()}&quot; →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}