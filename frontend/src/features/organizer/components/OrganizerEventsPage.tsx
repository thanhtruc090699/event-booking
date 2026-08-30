import Link from "next/link";
import { OrganizerEventRow } from "@/features/organizer/components/OrganizerEventRow";

const organizerEvents = [
    {
        id: 1,
        title: "Rock Concert Berlin",
        dateLabel: "20 Sep 2026",
        venue: "Berlin Arena",
        imageUrl: "https://picsum.photos/seed/event-1/120/120",
        status: "PUBLISHED" as const,
        soldTickets: 216,
        totalTickets: 300,
    },
    {
        id: 2,
        title: "Electronic Nights Hamburg",
        dateLabel: "02 Oct 2026",
        venue: "Hamburg Warehouse",
        imageUrl: "https://picsum.photos/seed/event-3/120/120",
        status: "PUBLISHED" as const,
        soldTickets: 98,
        totalTickets: 400,
    },
    {
        id: 3,
        title: "Winter Acoustic Session",
        dateLabel: "No date set",
        venue: "Draft venue",
        imageUrl: "https://picsum.photos/seed/event-7/120/120",
        status: "DRAFT" as const,
    },
];

export function OrganizerEventsPage() {
    return (
        <main className="mx-auto max-w-6xl px-5 py-12 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-sm text-[var(--muted)]">
                        Organizer
                    </p>

                    <h1 className="font-[var(--font-bebas)] text-5xl tracking-wide text-[var(--ink)]">
                        My Events
                    </h1>
                </div>

                <Link
                    href="/organizer/events/new"
                    className="inline-flex w-fit items-center justify-center rounded-lg border border-[var(--crimson)] bg-[var(--crimson)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                >
                    + Create Event
                </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full border border-[var(--gold)] bg-[var(--gold)] px-5 py-2 text-sm font-semibold text-[#3a2a08]">
                    All
                </button>

                <button className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]">
                    Draft
                </button>

                <button className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]">
                    Published
                </button>
            </div>

            <div className="mt-8 hidden grid-cols-[2fr_140px_180px_120px] gap-4 px-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)] md:grid">
                <div>Event</div>
                <div>Status</div>
                <div>Tickets sold</div>
                <div className="text-right">Action</div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                {organizerEvents.map((event) => (
                    <OrganizerEventRow
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        dateLabel={event.dateLabel}
                        venue={event.venue}
                        imageUrl={event.imageUrl}
                        status={event.status}
                        soldTickets={event.soldTickets}
                        totalTickets={event.totalTickets}
                    />
                ))}
            </div>
        </main>
    );
}