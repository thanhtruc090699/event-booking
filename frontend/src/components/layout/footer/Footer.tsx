import Link from "next/link";

const exploreLinks = [
    { label: "All Events", href: "/events" },
    { label: "Concerts", href: "/events?category=concert" },
    { label: "Festivals", href: "/events?category=festival" },
    { label: "Theatre", href: "/events?category=theatre" },
    { label: "Sports", href: "/events?category=sports" },
];

const accountLinks = [
    { label: "Sign in", href: "/login" },
    { label: "Sign up", href: "/register" },
    { label: "My Tickets", href: "/tickets" },
    { label: "Booking Help", href: "/help" },
];

const organizerLinks = [
    { label: "Create Event", href: "/organizer/events/new" },
    { label: "My Events", href: "/organizer/events" },
    { label: "Organizer Guide", href: "/organizer/guide" },
];

const legalLinks = [
    { label: "Terms", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "/contact" },
];

function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="mb-2.5 block text-sm text-[#c9c9ce] transition hover:text-[var(--gold)]"
        >
            {children}
        </Link>
    );
}

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                {title}
            </h4>

            {links.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                    {link.label}
                </FooterLink>
            ))}
        </div>
    );
}

export function Footer() {
    return (
        <footer className="mt-10 border-t border-[var(--border)]">
            <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
                <div>
                    <Link
                        href="/"
                        className="mb-3 block text-2xl tracking-tight text-[var(--ink)]"
                    >
                        STAGE<span className="text-[var(--crimson)]">PASS</span>
                    </Link>

                    <p className="max-w-[240px] text-sm leading-6 text-[var(--muted)]">
                        Event ticket booking platform with real-time seat
                        selection, reservation hold, payment flow, and instant
                        digital tickets.
                    </p>

                    <div className="mt-4 flex gap-2.5">
                        <a
                            href="#"
                            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        >
                            𝕏
                        </a>

                        <a
                            href="#"
                            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        >
                            IG
                        </a>

                        <a
                            href="#"
                            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        >
                            FB
                        </a>

                        <a
                            href="#"
                            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        >
                            in
                        </a>
                    </div>
                </div>

                <FooterColumn title="Explore" links={exploreLinks} />

                <FooterColumn title="Account" links={accountLinks} />

                <FooterColumn title="Organizer" links={organizerLinks} />

                <div>
                    <h4 className="mb-3.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                        New Events
                    </h4>

                    <p className="mb-3 text-sm leading-6 text-[var(--muted)]">
                        Subscribe to get updates about upcoming events near you.
                    </p>

                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                        />

                        <button
                            type="submit"
                            className="shrink-0 rounded-lg bg-[var(--crimson)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="mx-auto flex max-w-[1200px] flex-col gap-3 border-t border-[var(--border)] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-10">
                <p className="text-xs text-[var(--muted)]">
                    © 2026 StagePass. Portfolio project — not a real business.
                </p>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded border border-[var(--border)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--muted)]">
                        VISA
                    </span>
                    <span className="rounded border border-[var(--border)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--muted)]">
                        MASTERCARD
                    </span>
                    <span className="rounded border border-[var(--border)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--muted)]">
                        PAYPAL
                    </span>
                    <span className="rounded border border-[var(--border)] px-2 py-1 font-[var(--font-mono)] text-[10px] text-[var(--muted)]">
                        G PAY
                    </span>
                </div>

                <div className="flex gap-5">
                    {legalLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs text-[var(--muted)] transition hover:text-[var(--ink)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}