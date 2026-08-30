import Link from "next/link";

export function ReservationExpiredPage() {
    return (
        <main className="mx-auto max-w-[440px] px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--crimson)] bg-[rgba(255,61,87,0.12)] text-3xl text-[var(--crimson)]">
                ⏱
            </div>

            <h1 className="font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                Reservation expired
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Your seats are no longer reserved.
                <br />
                Please select your seats again to continue.
            </p>

            <Link
                href="/events/1#seat-selection"
                className="mt-7 block rounded-lg bg-[var(--crimson)] px-5 py-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
            >
                Return to Seat Selection
            </Link>
        </main>
    );
}