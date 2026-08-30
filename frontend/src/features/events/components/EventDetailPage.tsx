import { Button } from "@/components/ui/Button";
import { SeatMap } from "@/features/booking/components/SeatMap";

type EventDetailPageProps = {
    eventId: string;
};

const event = {
    title: "Rock Concert Berlin",
    category: "Concert",
    venue: "Berlin Arena",
    city: "Berlin",
    date: "Sunday, 20 September 2026",
    time: "19:00",
    description:
        "A large-scale rock concert bringing together leading European rock bands, recreating the atmosphere of Berlin's legendary 90s music scene with a full lighting setup and a three-hour stage performance.",
    imageUrl: "https://picsum.photos/seed/event-1/1600/900",
    startingPrice: "49.99 €",
    availableSeats: 84,
};

export function EventDetailPage({ eventId }: EventDetailPageProps) {
    return (
        <main>
            <section className="relative min-h-[520px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${event.imageUrl})`,
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[rgba(10,10,12,0.72)] to-[rgba(10,10,12,0.15)]" />

                <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-14 pt-64 md:px-10 lg:grid-cols-[1fr_340px] lg:items-end">
                    <div>
                        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
                            {event.category}
                        </span>

                        <h1 className="mt-5 font-[var(--font-bebas)] text-5xl leading-none tracking-wide text-[var(--ink)] md:text-6xl">
                            {event.title}
                        </h1>

                        <div className="mt-6 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
                            <span>📍 {event.venue}</span>
                            <span>🗓 {event.date}</span>
                            <span>🕖 {event.time}</span>
                        </div>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                            {event.description}
                        </p>

                        <p className="mt-4 font-[var(--font-mono)] text-xs text-[var(--muted)]">
                            Event ID: {eventId}
                        </p>
                    </div>

                    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                        <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                            Tickets from
                        </p>

                        <p className="mt-2 font-[var(--font-bebas)] text-5xl tracking-wide text-[var(--ink)]">
                            {event.startingPrice}
                        </p>

                        <p className="mt-3 text-sm font-medium text-[var(--gold)]">
                            ● {event.availableSeats} seats available
                        </p>

                        <a
                            href="#seat-selection"
                            className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--gold)]"
                        >
                            View Seat Map
                        </a>
                    </aside>
                </div>
            </section>

            <SeatMap eventId={eventId}/>
        </main>
    );
}