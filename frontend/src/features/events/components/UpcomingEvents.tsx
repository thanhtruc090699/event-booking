import { EventCard } from "@/features/events/components/EventCard";

const upcomingEvents = [
    {
        id: 2,
        title: "Jazz Night Munich",
        venue: "Munich Philharmonic",
        date: "25 Sep",
        imageUrl: "https://picsum.photos/seed/event-2/480/270",
    },
    {
        id: 3,
        title: "Electronic Nights Hamburg",
        venue: "Hamburg Warehouse",
        date: "02 Oct",
        imageUrl: "https://picsum.photos/seed/event-3/480/270",
    },
    {
        id: 4,
        title: "Classical Symphony Vienna",
        venue: "Vienna State Opera",
        date: "10 Oct",
        imageUrl: "https://picsum.photos/seed/event-4/480/270",
    },
    {
        id: 5,
        title: "Indie Fest Frankfurt",
        venue: "Riverside Park",
        date: "18 Oct",
        imageUrl: "https://picsum.photos/seed/event-5/480/270",
    },
];

export function UpcomingEventsSection() {
    return (
        <section className="mx-auto max-w-6xl px-5 pt-8 md:px-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="font-[var(--font-bebas)] text-3xl tracking-wide text-[var(--ink)]">
                    Upcoming Near You
                </h2>

                <button className="text-xs font-medium text-[var(--muted)] transition hover:text-[var(--ink)]">
                    View all →
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3">
                {upcomingEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        venue={event.venue}
                        date={event.date}
                        imageUrl={event.imageUrl}
                    />
                ))}
            </div>
        </section>
    );
}