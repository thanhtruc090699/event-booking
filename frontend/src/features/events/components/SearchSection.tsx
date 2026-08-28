"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const categories = ["All", "Concert", "Festival", "Theatre", "Sports"];

export function SearchSection() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <section className="mx-auto max-w-6xl px-5 pt-9 md:px-10">
            <h2 className="mb-4 font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                Explore Events
            </h2>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 md:max-w-xl md:flex-1">
                    <Search className="h-4 w-4 text-[var(--muted)]" />

                    <input
                        type="text"
                        placeholder="Search events, cities, venues..."
                        className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                    />
                </div>

                <select
                    aria-label="City"
                    className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--muted)] outline-none transition focus:border-zinc-600 focus:text-[var(--ink)]"
                >
                    <option>All cities</option>
                    <option>Berlin</option>
                    <option>Hamburg</option>
                    <option>Munich</option>
                    <option>Frankfurt</option>
                </select>

                <input
                    type="date"
                    aria-label="Event date"
                    className="h-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--muted)] outline-none transition focus:border-zinc-600 focus:text-[var(--ink)]"
                />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "rounded-full border px-5 py-2 text-sm transition",
                            activeCategory === category
                                ? "border-[var(--gold)] bg-[var(--gold)] font-semibold text-[#3a2a08]"
                                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </section>
    );
}