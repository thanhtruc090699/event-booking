"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { getEventSeats } from "@/features/events/api/eventsApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createReservation } from "@/features/booking/api/bookingApi";

type SeatStatus = "available" | "selected" | "held" | "booked";

type Seat = {
    id: string;
    row: number;
    number: number;
    baseStatus: Exclude<SeatStatus, "selected">;
    price: number;
};

type SeatMapProps = {
    eventId: string;
};

const seatsPerRow = 8;

function convertSeatStatus(status: "AVAILABLE" | "RESERVED" | "BOOKED"): "available" | "held" | "booked" {
    switch (status) {
        case "AVAILABLE": return "available";
        case "RESERVED": return "held";
        case "BOOKED": return "booked";
    }
}

function getSeatClass(status: SeatStatus) {
    return cn(
        "flex h-10 w-10 items-center justify-center rounded-lg border font-[var(--font-mono)] text-xs transition",
        status === "available" &&
        "border-zinc-700 bg-[var(--surface-hover)] text-[var(--ink)] hover:border-[var(--gold)]",
        status === "selected" &&
        "border-[var(--gold)] bg-[var(--gold)] font-bold text-[var(--void)]",
        status === "held" &&
        "border-dashed border-[var(--crimson)] bg-[var(--surface-hover)] text-[var(--crimson)] opacity-70",
        status === "booked" &&
        "border-[var(--border)] bg-[var(--void)] text-zinc-700"
    );
}

function LegendItem({
                        label,
                        status,
                    }: {
    label: string;
    status: SeatStatus;
}) {
    return (
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <span
                className={cn(
                    "h-4 w-4 rounded border",
                    status === "available" && "border-zinc-700 bg-[var(--surface-hover)]",
                    status === "selected" && "border-[var(--gold)] bg-[var(--gold)]",
                    status === "held" && "border-dashed border-[var(--crimson)] bg-[var(--surface-hover)]",
                    status === "booked" && "border-[var(--border)] bg-[var(--void)]"
                )}
            />
            {label}
        </div>
    );
}

export function SeatMap({ eventId }: SeatMapProps) {
    const router = useRouter();
    const { accessToken, isAuthenticated } = useAuth();
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
    const [creatingReservation, setCreatingReservation] = useState(false);

    useEffect(() => {
        async function fetchSeats() {
            try {
                const data = await getEventSeats(eventId);
                const convertedSeats = data.map((seat) => ({
                    id: seat.id.toString(),
                    row: parseInt(seat.rowLabel),
                    number: parseInt(seat.seatNumber),
                    baseStatus: convertSeatStatus(seat.status),
                    price: seat.price,
                }));
                setSeats(convertedSeats);
            } catch (error) {
                console.error("Failed to fetch seats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSeats();
    }, [eventId]);

    if (loading) {
        return (
            <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--muted)]">Loading seats...</p>
                </div>
            </section>
        );
    }

    function getStatus(seat: Seat): SeatStatus {
        if (selectedSeatIds.includes(seat.id)) {
            return "selected";
        }
        return seat.baseStatus;
    }

    function toggleSeat(seat: Seat) {
        if (seat.baseStatus === "held" || seat.baseStatus === "booked") {
            return;
        }

        setSelectedSeatIds((current) =>
            current.includes(seat.id)
                ? current.filter((seatId) => seatId !== seat.id)
                : [...current, seat.id]
        );
    }

    const orderedSeats = [...seats].sort(
        (first, second) => first.row - second.row || first.number - second.number
    );
    const seatRows = Array.from(
        { length: Math.ceil(orderedSeats.length / seatsPerRow) },
        (_, rowIndex) => orderedSeats.slice(
            rowIndex * seatsPerRow,
            (rowIndex + 1) * seatsPerRow
        )
    );

    async function continueToBooking() {
        if (selectedSeatIds.length === 0) {
            return;
        }

        if (!isAuthenticated) {
            router.push(`/login?redirect=/events/${eventId}`);
            return;
        }

        try {
            setCreatingReservation(true);
            
            const payload = {
                eventId: parseInt(eventId),
                seatIds: selectedSeatIds.map(id => parseInt(id)),
            };

            const response = await createReservation(payload, accessToken!);
            
            router.push(`/booking/checkout?reservationId=${response.id}`);
        } catch (error) {
            console.error("Failed to create reservation:", error);
            alert("Failed to reserve seats. Please try again.");
        } finally {
            setCreatingReservation(false);
        }
    }

    return (
        <section
            id="seat-selection"
            className="mx-auto max-w-6xl px-5 py-12 md:px-10"
        >
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-8">
                <div className="mb-10 rounded-lg bg-[var(--border)] px-4 py-3 text-center font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Stage
                </div>

                <div className="overflow-x-auto">
                    <div className="mx-auto flex min-w-[400px] w-fit flex-col gap-3">
                        {seatRows.map((rowSeats, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="grid grid-cols-8 gap-3"
                            >
                                {rowSeats.map((seat) => {
                                    const status = getStatus(seat);

                                    return (
                                        <button
                                            key={seat.id}
                                            type="button"
                                            disabled={
                                                seat.baseStatus === "held" ||
                                                seat.baseStatus === "booked"
                                            }
                                            onClick={() => toggleSeat(seat)}
                                            className={getSeatClass(status)}
                                            aria-label={`Row ${seat.row}, Seat ${seat.number}, ${status}`}
                                        >
                                            {seat.number}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3">
                    <LegendItem label="Available" status="available" />
                    <LegendItem label="Selected" status="selected" />
                    <LegendItem label="Held" status="held" />
                    <LegendItem label="Booked" status="booked" />
                </div>

                <div className="mt-8 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--void)] p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">
                            Selected seats
                        </p>

                        <p className="mt-2 text-sm text-[var(--muted)]">
                            {selectedSeatIds.length > 0
                                ? selectedSeatIds.join(", ")
                                : "Select one or more available seats to continue."}
                        </p>
                    </div>

                    <Button
                        type="button"
                        disabled={selectedSeatIds.length === 0 || creatingReservation}
                        onClick={continueToBooking}
                        className="w-full md:w-auto"
                    >
                        {creatingReservation ? "Reserving..." : "Continue to Checkout"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
