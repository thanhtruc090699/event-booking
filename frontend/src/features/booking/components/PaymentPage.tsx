"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentOption } from "@/features/booking/components/PaymentOption";
import { TimerBanner } from "@/features/booking/components/TimerBanner";
import {
    formatEuro,
    getOrderTotal,
} from "@/features/booking/data/mockBooking";

export function PaymentPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const orderTotal = getOrderTotal();

    function handlePayment() {
        setIsProcessing(true);

        window.setTimeout(() => {
            router.push("/booking/confirmation");
        }, 900);
    }

    return (
        <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
            <Link
                href="/booking/checkout"
                className="mb-2 block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to checkout
            </Link>

            <h1 className="mb-[18px] font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                Payment
            </h1>

            <TimerBanner
                label="Reservation expires in"
                time="06:58"
            />

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Order total
                </h2>

                <div className="flex justify-between text-base font-bold text-[var(--ink)]">
                    <span>Total to pay</span>
                    <span className="font-[var(--font-mono)] text-[var(--gold)]">
                        {formatEuro(orderTotal)}
                    </span>
                </div>
            </section>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <div className="mb-3.5 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Payment method
                    </h2>

                    <Link
                        href="/booking/checkout"
                        className="text-xs font-semibold text-[var(--gold)]"
                    >
                        Change
                    </Link>
                </div>

                <PaymentOption label="Credit / Debit Card" selected />
            </section>

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Card details
                </h2>

                <div className="mb-3.5">
                    <label className="mb-1.5 block text-xs text-[var(--muted)]">
                        Cardholder name
                    </label>
                    <input
                        defaultValue="Max Mustermann"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                    />
                </div>

                <div className="mb-3.5">
                    <label className="mb-1.5 block text-xs text-[var(--muted)]">
                        Card number
                    </label>
                    <input
                        defaultValue="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                    />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs text-[var(--muted)]">
                            Expiry
                        </label>
                        <input
                            defaultValue="09 / 28"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs text-[var(--muted)]">
                            CVC
                        </label>
                        <input
                            defaultValue="•••"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                        />
                    </div>
                </div>
            </section>

            <div className="sticky bottom-0 bg-[linear-gradient(to_top,var(--void)_60%,transparent)] py-5">
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePayment}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--crimson)] px-5 py-4 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)] disabled:cursor-not-allowed disabled:opacity-80"
                >
                    {isProcessing && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {isProcessing
                        ? "Processing payment..."
                        : `Pay ${formatEuro(orderTotal)}`}
                </button>
            </div>
        </main>
    );
}