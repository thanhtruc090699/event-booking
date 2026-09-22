import Image from "next/image";
import { cn } from "@/lib/cn";

type TicketStatus = "UPCOMING" | "USED" | "CANCELLED";

type TicketCardProps = {
    eventTitle: string;
    eventImageUrl: string;
    section: string;
    row: string;
    seat: string;
    dateTime: string;
    ticketCode: string;
    status: TicketStatus;
};

function getStatusLabel(status: TicketStatus) {
    if (status === "UPCOMING") {
        return "UPCOMING";
    }

    if (status === "USED") {
        return "USED";
    }

    return "CANCELLED";
}

function getStatusClass(status: TicketStatus) {
    return cn(
        "mb-1 inline-block rounded-md px-3 py-1 text-[10px] font-bold tracking-[0.05em]",
        status === "UPCOMING" &&
        "border border-[var(--gold)] bg-[rgba(245,184,65,0.15)] text-[var(--gold)]",
        status === "USED" &&
        "border border-[var(--border)] bg-[var(--void)] text-[var(--muted)]",
        status === "CANCELLED" &&
        "border border-[var(--crimson)] bg-[rgba(255,61,87,0.12)] text-[var(--crimson)]"
    );
}

export function TicketCard({
                               eventTitle,
                               eventImageUrl,
                               section,
                               row,
                               seat,
                               dateTime,
                               ticketCode,
                               status,
                           }: TicketCardProps) {
    return (
        <article className="relative grid rounded-2xl border border-[var(--border)] bg-[var(--surface)] md:grid-cols-[1fr_auto]">
            <span className="absolute left-[-10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[var(--border)] bg-[var(--void)]" />
            <span className="absolute right-[-10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[var(--border)] bg-[var(--void)]" />

            <div className="flex items-center gap-4 px-6 py-[18px]">
                <div className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg",
                    status === "USED" && "grayscale"
                )}>
                    <Image
                        src={eventImageUrl}
                        alt={eventTitle}
                        fill
                        className="object-cover"
                    />
                </div>

                <div>
                    <span className={getStatusClass(status)}>
                        {getStatusLabel(status)}
                    </span>

                    <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                        {eventTitle}
                    </h3>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                        {section} · {row} · {seat} — {dateTime}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 border-t-2 border-dashed border-[#2c2c33] px-6 py-[18px] md:min-w-[170px] md:border-l-2 md:border-t-0">
                <span className="text-xs text-[var(--muted)]">
                    TICKET CODE
                </span>

                <span className="font-[var(--font-mono)] text-sm text-[var(--ink)]">
                    {ticketCode}
                </span>
            </div>
        </article>
    );
}