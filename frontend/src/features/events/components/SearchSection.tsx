"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SearchBox } from "@/features/events/components/SearchBox";

const categories = ["All", "Concert", "Festival", "Theatre", "Sports"];

export function SearchSection() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <section className="mx-auto max-w-6xl px-5 pt-9 md:px-10">
            <h2 className="mb-4 font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                Explore Events
            </h2>

            <SearchBox />

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