import Link from "next/link";
import { cn } from "@/lib/cn";

type OrganizerEventStatus = "PUBLISHED" | "DRAFT";

type OrganizerEventRowProps = {
    id: number;
    title: string;
    dateLabel: string;
    venue: string;
    imageUrl: string;
    status: OrganizerEventStatus;
    soldTickets?: number;
    totalTickets?: number;
};

function getStatusClass(status: OrganizerEventStatus) {
    return cn(
        "inline-flex w-fit rounded-md border px-3 py-1 text-xs font-semibold",
        status === "PUBLISHED" &&
        "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]",
        status === "DRAFT" &&
        "border-[var(--border)] bg-[var(--void)] text-[var(--muted)]"
    );
}

export function OrganizerEventRow({
                                      id,
                                      title,
                                      dateLabel,
                                      venue,
                                      imageUrl,
                                      status,
                                      soldTickets,
                                      totalTickets,
                                  }: OrganizerEventRowProps) {
    const hasSalesData =
        typeof soldTickets === "number" && typeof totalTickets === "number";

    const soldPercentage =
        hasSalesData && totalTickets > 0
            ? Math.round((soldTickets / totalTickets) * 100)
            : 0;

    return (
        <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[2fr_140px_180px_120px] md:items-center">
            <div className="flex items-center gap-4">
                <div
                    className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />

                <div>
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                        {dateLabel} · {venue}
                    </p>
                </div>
            </div>

            <div>
                <span className={getStatusClass(status)}>{status}</span>
            </div>

            <div>
                {hasSalesData ? (
                    <>
                        <p className="text-sm font-semibold text-[var(--ink)]">
                            {soldTickets} / {totalTickets}
                        </p>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--void)]">
                            <div
                                className="h-full rounded-full bg-[var(--gold)]"
                                style={{ width: `${soldPercentage}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-[var(--muted)]">—</p>
                )}
            </div>

            <div className="flex justify-start md:justify-end">
                <Link
                    href={`/organizer/events/${id}/edit`}
                    className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}