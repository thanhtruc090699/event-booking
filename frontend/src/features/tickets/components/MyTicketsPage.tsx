"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { TicketCard } from "@/features/tickets/components/TicketCard";

type TicketTab = "upcoming" | "past";

const upcomingTickets = [
    {
        eventTitle: "Rock Concert Berlin",
        eventImageUrl: "https://picsum.photos/seed/event-1/120/120",
        section: "Section A",
        row: "Row 2",
        seat: "Seat 5",
        dateTime: "20/09/2026, 19:00",
        ticketCode: "TCK-9001",
        status: "UPCOMING" as const,
    },
    {
        eventTitle: "Electronic Nights Hamburg",
        eventImageUrl: "https://picsum.photos/seed/event-3/120/120",
        section: "Section B",
        row: "Row 1",
        seat: "Seat 3",
        dateTime: "02/10/2026, 22:00",
        ticketCode: "TCK-9014",
        status: "UPCOMING" as const,
    },
    {
        eventTitle: "Stand-up Comedy Cologne",
        eventImageUrl: "https://picsum.photos/seed/event-6/120/120",
        section: "Section C",
        row: "Row 1",
        seat: "Seat 1",
        dateTime: "28/09/2026, 20:30",
        ticketCode: "TCK-8990",
        status: "CANCELLED" as const,
    },
];

const pastTickets = [
    {
        eventTitle: "Classical Symphony Vienna",
        eventImageUrl: "https://picsum.photos/seed/event-4/120/120",
        section: "Section A",
        row: "Row 3",
        seat: "Seat 8",
        dateTime: "10/08/2026, 19:30",
        ticketCode: "TCK-8801",
        status: "USED" as const,
    },
];

export function MyTicketsPage() {
    const [activeTab, setActiveTab] = useState<TicketTab>("upcoming");

    const tickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

    return (
        <main className="mx-auto max-w-[900px] px-5 pt-9 md:px-10">
            <h1 className="font-[var(--font-bebas)] text-[38px] tracking-wide text-[var(--ink)]">
                My Tickets
            </h1>

            <div className="mt-[18px] flex gap-2 border-b border-[var(--border)]">
                <button
                    type="button"
                    onClick={() => setActiveTab("upcoming")}
                    className={cn(
                        "border-b-2 px-[18px] py-[10px] text-sm transition",
                        activeTab === "upcoming"
                            ? "border-[var(--crimson)] font-semibold text-[var(--ink)]"
                            : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                    )}
                >
                    Upcoming
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("past")}
                    className={cn(
                        "border-b-2 px-[18px] py-[10px] text-sm transition",
                        activeTab === "past"
                            ? "border-[var(--crimson)] font-semibold text-[var(--ink)]"
                            : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                    )}
                >
                    Past
                </button>
            </div>

            <div className="flex flex-col gap-[14px] pt-5">
                {tickets.map((ticket) => (
                    <TicketCard
                        key={ticket.ticketCode}
                        eventTitle={ticket.eventTitle}
                        eventImageUrl={ticket.eventImageUrl}
                        section={ticket.section}
                        row={ticket.row}
                        seat={ticket.seat}
                        dateTime={ticket.dateTime}
                        ticketCode={ticket.ticketCode}
                        status={ticket.status}
                    />
                ))}
            </div>
        </main>
    );
}