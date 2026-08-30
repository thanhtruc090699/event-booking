import { Button } from "@/components/ui/Button";
import { SeatConfigurationSection} from "@/features/organizer/components/SeatConfigurationSection";

type EventFormPageProps = {
    mode: "create" | "edit";
    eventId?: string;
};

export function EventFormPage({ mode, eventId }: EventFormPageProps) {
    const isEditMode = mode === "edit";

    return (
        <main className="mx-auto max-w-4xl px-5 py-12 md:px-10">
            <div className="mb-8">
                <p className="mb-2 text-sm text-[var(--muted)]">
                    Organizer / {isEditMode ? "Edit Event" : "Create Event"}
                </p>

                <h1 className="font-[var(--font-bebas)] text-5xl tracking-wide text-[var(--ink)]">
                    {isEditMode ? "Edit Event" : "Create New Event"}
                </h1>

                {isEditMode && (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Event ID: {eventId}
                    </p>
                )}
            </div>

            <form className="space-y-6">
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                    <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--gold)]">
                        Basic Information
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm text-[var(--muted)]">
                                Event name
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Rock Concert Berlin"
                                className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--muted)]">
                                Description
                            </label>

                            <textarea
                                placeholder="Short description of the event..."
                                rows={4}
                                className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600"
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    Category
                                </label>

                                <select className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-zinc-600">
                                    <option>Concert</option>
                                    <option>Festival</option>
                                    <option>Theatre</option>
                                    <option>Sports</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    Banner image URL
                                </label>

                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                    <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--gold)]">
                        Location & Time
                    </h2>

                    <div className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    Venue name
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Berlin Arena"
                                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Berlin"
                                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    Event date
                                </label>

                                <input
                                    type="date"
                                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[var(--muted)]">
                                    Start time
                                </label>

                                <input
                                    type="time"
                                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <SeatConfigurationSection />

                <div className="flex justify-end gap-4 pb-10">
                    <Button variant="secondary" type="button">
                        Save Draft
                    </Button>

                    <Button type="submit">
                        Publish Event
                    </Button>
                </div>
            </form>
        </main>
    );
}