"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";

type SeatStatus = "available" | "selected" | "held" | "booked";


type Seat = {
    id: string;
    row: number;
    number: number;
    baseStatus: Exclude<SeatStatus, "selected">;
};

type SeatMapProps = {
    eventId: string;
};

const rows = 4;
const seatsPerRow = 8;

function createSeats(): Seat[] {
    const seats: Seat[] = [];

    for (let row = 1; row <= rows; row++) {
        for (let number = 1; number <= seatsPerRow; number++) {
            let baseStatus: Seat["baseStatus"] = "available";

            if (number === 5) {
                baseStatus = "held";
            }

            if (number === 6) {
                baseStatus = "booked";
            }

            seats.push({
                id: `A-${row}-${number}`,
                row,
                number,
                baseStatus,
            });
        }
    }

    return seats;
}

const seats = createSeats();

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
            <span className={cn("h-4 w-4 rounded", getSeatClass(status))} />
            {label}
        </div>
    );
}

export function SeatMap({ eventId }: SeatMapProps) {

    const router = useRouter();
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

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

    function continueToBooking() {
        if (selectedSeatIds.length === 0) {
            return;
        }

        router.push("/booking/checkout");

        console.log("Continue booking", {
            eventId,
            selectedSeatIds,
        });

        // Later:
        // 1. POST /api/reservations
        // 2. backend holds selected seats
        // 3. redirect to booking/checkout page
    }

    return (
        <section
            id="seat-selection"
            className="mx-auto max-w-6xl px-5 py-12 md:px-10"
        >
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
                <div className="mb-8 rounded-lg bg-[var(--border)] px-4 py-3 text-center font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Stage
                </div>

                <div className="overflow-x-auto">
                    <div className="mx-auto min-w-[440px]">
                        {Array.from({ length: rows }).map((_, rowIndex) => {
                            const rowNumber = rowIndex + 1;
                            const rowSeats = seats.filter(
                                (seat) => seat.row === rowNumber
                            );

                            return (
                                <div
                                    key={rowNumber}
                                    className="mb-3 flex justify-center gap-3"
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
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-5">
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
                        disabled={selectedSeatIds.length === 0}
                        onClick={continueToBooking}
                        className="w-full md:w-auto"
                    >
                        Select Seats
                    </Button>
                </div>
            </div>
        </section>
    );
}