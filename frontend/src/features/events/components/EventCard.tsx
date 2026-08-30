import Link from "next/link";
import { cn } from "@/lib/cn";

type EventCardProps = {
    id: number;
    title: string;
    venue: string;
    date: string;
    imageUrl: string;
    hot?: boolean;
    className?: string;
};

export function EventCard({
                              id,
                              title,
                              venue,
                              date,
                              imageUrl,
                              hot = false,
                              className,
                          }: EventCardProps) {
    return (
        <Link
            href={`/events/${id}`}
            className={cn(
                "group relative block min-w-[220px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:bg-[var(--surface-hover)]",
                className
            )}
        >
            {hot && (
                <span className="absolute left-2 top-2 z-10 rounded-md bg-[var(--crimson)] px-2 py-1 text-[10px] font-bold tracking-wide text-[var(--ink)]">
                    HOT
                </span>
            )}

            <img
                src={imageUrl}
                alt={title}
                className="h-[120px] w-full object-cover"
            />

            <div className="p-3">
                <h3 className="truncate text-sm font-semibold text-[var(--ink)]">
                    {title}
                </h3>

                <p className="mt-1 text-xs text-[var(--muted)]">
                    {venue} · {date}
                </p>
            </div>
        </Link>
    );
}