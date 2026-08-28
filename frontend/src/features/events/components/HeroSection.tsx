import { Button } from "@/components/ui/Button";

export function HeroSection() {
    return (
        <section className="flex min-h-[440px] items-end bg-[var(--void)] px-10 pb-10">

            <div className="max-w-2xl">

                <p className="mb-2 font-[var(--font-mono)] text-xs tracking-[0.3em] text-[var(--gold)]">
                    FEATURED EVENT
                </p>

                <h1 className="font-[var(--font-bebas)] text-6xl leading-none tracking-wide text-[var(--ink)]">
                    Rock Concert Berlin
                </h1>

                <p className="mt-4 text-sm text-[var(--muted)]">
                    Berlin Arena · Sunday, 20 September 2026 · 19:00
                </p>

                <div className="mt-6 flex gap-3">

                    <Button>
                        View Details
                    </Button>

                    <Button variant="secondary">
                        Book Tickets
                    </Button>

                </div>

            </div>

        </section>
    );
}