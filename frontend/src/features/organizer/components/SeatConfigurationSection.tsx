"use client";

import { useState } from "react";

type SectionPrice = {
    name: string;
    price: string;
};

const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-zinc-600";

const labelClass = "mb-2 block text-sm text-[var(--muted)]";

function getSectionName(index: number) {
    return String.fromCharCode(65 + index); // 0 -> A, 1 -> B, 2 -> C
}

function buildSectionPrices(count: number, previous: SectionPrice[] = []) {
    return Array.from({ length: count }, (_, index) => ({
        name: getSectionName(index),
        price: previous[index]?.price ?? "",
    }));
}

function toPositiveNumber(value: string, fallback: number) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback;
    }

    return parsed;
}

export function SeatConfigurationSection() {
    const [numberOfSections, setNumberOfSections] = useState(3);
    const [rowsPerSection, setRowsPerSection] = useState(4);
    const [seatsPerRow, setSeatsPerRow] = useState(8);

    const [sectionPrices, setSectionPrices] = useState<SectionPrice[]>(
        () => buildSectionPrices(3)
    );

    const totalSeats = numberOfSections * rowsPerSection * seatsPerRow;

    function handleSectionCountChange(value: string) {
        const nextCount = toPositiveNumber(value, 1);

        setNumberOfSections(nextCount);
        setSectionPrices((current) => buildSectionPrices(nextCount, current));
    }

    function handlePriceChange(index: number, value: string) {
        setSectionPrices((current) =>
            current.map((section, currentIndex) =>
                currentIndex === index
                    ? {
                        ...section,
                        price: value,
                    }
                    : section
            )
        );
    }

    return (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--gold)]">
                Seat Configuration
            </h2>

            <p className="mb-5 text-sm leading-6 text-[var(--muted)]">
                Configure the number of sections, rows, seats per row and ticket price per section.
                The backend will generate the full seat inventory automatically when the event is saved.
            </p>

            <div className="grid gap-5 md:grid-cols-3">
                <div>
                    <label className={labelClass}>Number of sections</label>
                    <input
                        name="numberOfSections"
                        type="number"
                        min={1}
                        value={numberOfSections}
                        onChange={(event) =>
                            handleSectionCountChange(event.target.value)
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Rows per section</label>
                    <input
                        name="rowsPerSection"
                        type="number"
                        min={1}
                        value={rowsPerSection}
                        onChange={(event) =>
                            setRowsPerSection(
                                toPositiveNumber(event.target.value, 1)
                            )
                        }
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Seats per row</label>
                    <input
                        name="seatsPerRow"
                        type="number"
                        min={1}
                        value={seatsPerRow}
                        onChange={(event) =>
                            setSeatsPerRow(
                                toPositiveNumber(event.target.value, 1)
                            )
                        }
                        className={inputClass}
                    />
                </div>
            </div>

            <p className="mt-5 text-sm text-[var(--muted)]">
                Total:{" "}
                <span className="font-semibold text-[var(--ink)]">
                    {totalSeats} seats
                </span>{" "}
                will be generated automatically.
            </p>

            <div className="mt-6">
                <label className={labelClass}>Price per section (€)</label>

                <div className="grid gap-5 md:grid-cols-3">
                    {sectionPrices.map((section, index) => (
                        <input
                            key={section.name}
                            name={`sections.${index}.price`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={section.price}
                            onChange={(event) =>
                                handlePriceChange(index, event.target.value)
                            }
                            placeholder={`Section ${section.name} — 79.99`}
                            className={inputClass}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}