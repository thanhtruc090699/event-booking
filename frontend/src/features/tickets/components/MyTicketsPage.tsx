"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { TicketCard } from "@/features/tickets/components/TicketCard";
import { getCustomerBookings } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { CustomerBookingDto } from "@/features/booking/api/bookingApi";

type TicketTab = "upcoming" | "past";

function getStatusLabel(status: string): "UPCOMING" | "USED" | "CANCELLED" {
    if (status === "CONFIRMED") return "UPCOMING";
    if (status === "CANCELLED") return "CANCELLED";
    return "USED";
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function MyTicketsPage() {
    const [activeTab, setActiveTab] = useState<TicketTab>("upcoming");
    const [bookings, setBookings] = useState<CustomerBookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { accessToken, isAuthenticated } = useAuth();

    useEffect(() => {
        const loadBookings = async () => {
            try {
                if (!accessToken) {
                    setLoading(false);
                    return;
                }

                const data = await getCustomerBookings(accessToken);
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [accessToken]);

    const tickets = bookings.map(booking => ({
        eventTitle: booking.event.title,
        eventImageUrl: booking.event.imageUrl,
        section: `Section ${booking.seat.section}`,
        row: `Row ${booking.seat.rowLabel}`,
        seat: `Seat ${booking.seat.seatNumber}`,
        dateTime: formatDate(booking.event.startDate),
        ticketCode: booking.bookingReference,
        status: getStatusLabel(booking.status),
    }));

    const displayedTickets = activeTab === "upcoming" 
        ? tickets.filter(t => t.status === "UPCOMING" || t.status === "CANCELLED")
        : tickets.filter(t => t.status === "USED");

    if (!isAuthenticated) {
        return (
            <main className="mx-auto max-w-[900px] px-5 pt-9 md:px-10">
                <h1 className="font-[var(--font-bebas)] text-[38px] tracking-wide text-[var(--ink)]">
                    My Tickets
                </h1>
                <div className="mt-[18px] text-center">
                    <p className="text-[var(--muted)]">Please login to view your tickets</p>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-[900px] px-5 pt-9 md:px-10">
                <h1 className="font-[var(--font-bebas)] text-[38px] tracking-wide text-[var(--ink)]">
                    My Tickets
                </h1>
                <div className="mt-[18px] flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--muted)]">Loading your tickets...</p>
                </div>
            </main>
        );
    }

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
                {displayedTickets.length === 0 ? (
                    <div className="text-center py-10 text-[var(--muted)]">
                        No {activeTab} tickets found
                    </div>
                ) : (
                    displayedTickets.map((ticket) => (
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
                    ))
                )}
            </div>
        </main>
    );
}