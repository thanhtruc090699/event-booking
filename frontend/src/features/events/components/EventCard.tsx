import Link from "next/link";

type EventCardProps = {
    id: number;
    title: string;
    venue: string;
    date: string;
    imageUrl: string;
};

export function EventCard({
                              id,
                              title,
                              venue,
                              date,
                              imageUrl,
                          }: EventCardProps) {
    return (
        <Link
            href={`/events/${id}`}
            className="group relative min-w-[220px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:bg-[var(--surface-hover)]"
        >
            <div
                className="h-[120px] w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
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