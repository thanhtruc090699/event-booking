"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TimerBanner } from "@/features/booking/components/TimerBanner";
import { createBooking, getReservation, PaymentMethod } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatEuro } from "@/features/booking/data/mockBooking";
import { PaymentProviderType } from "@/features/payments/api/paymentsApi";
import { PaymentButton } from "@/features/payments/components/PaymentButton";
import { PaymentMethodList } from "@/features/payments/components/PaymentMethod";

const providerToPaymentMethod: Record<PaymentProviderType, PaymentMethod> = {
  [PaymentProviderType.PAYPAL]: "PAYPAL",
  [PaymentProviderType.STRIPE]: "CREDIT_CARD",
};

const PAYPAL_CLIENT_ID = "sb"; // Sandbox mode - thay bằng client ID thật

export function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId");
    const { accessToken } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProviderType | null>(null);
    const [reservation, setReservation] = useState<{ totalAmount: number } | null>(null);
    const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
    
    useEffect(() => {
        if (!reservationId || !accessToken) return;
        
        getReservation(reservationId, accessToken)
            .then(data => {
                const totalAmount = data.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
                setReservation({ totalAmount });
            })
            .catch(err => {
                console.error("Failed to fetch reservation:", err);
            });
    }, [reservationId, accessToken]);

    async function handleCreateBooking(captureId?: string) {
        if (!reservationId || !accessToken || !selectedPaymentMethod) return;
        
        setIsProcessing(true);

        try {
            const response = await createBooking({
                reservationId: parseInt(reservationId),
                paymentMethod: providerToPaymentMethod[selectedPaymentMethod],
            }, accessToken);
            
            router.push(`/booking/confirmation?bookingId=${response.id}`);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    }

    async function handlePayPalSuccess(orderId: string, captureId: string) {
        setPaypalOrderId(orderId);
        await handleCreateBooking(captureId);
    }

    if (!reservationId || !accessToken) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="text-center">
                    <p className="text-[var(--muted)]">Please login to continue</p>
                    <Link href={`/login?redirect=/booking/payment?reservationId=${reservationId}`} className="mt-4 inline-block text-[var(--gold)]">
                        Login →
                    </Link>
                </div>
            </main>
        );
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
                expiresAt={new Date(Date.now() + 10 * 60 * 1000).toISOString()}
            />

            <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Order total
                </h2>

                <div className="flex justify-between text-base font-bold text-[var(--ink)]">
                    <span>Total to pay</span>
                    <span className="font-[var(--font-mono)] text-[var(--gold)]">
                        {reservation ? formatEuro(reservation.totalAmount) : "..."}
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

                <PaymentMethodList
                    selected={selectedPaymentMethod}
                    onSelect={setSelectedPaymentMethod}
                />
            </section>

            {selectedPaymentMethod === PaymentProviderType.PAYPAL && reservation && (
                <section className="mb-[18px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                    <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Complete payment with PayPal
                    </h2>
                    <PaymentButton
                        providerType={PaymentProviderType.PAYPAL}
                        clientId={PAYPAL_CLIENT_ID}
                        amount={reservation.totalAmount}
                        currency="EUR"
                        onSuccess={handlePayPalSuccess}
                    />
                </section>
            )}

            {selectedPaymentMethod !== PaymentProviderType.PAYPAL && (
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
            )}

            <div className="sticky bottom-0 bg-[linear-gradient(to_top,var(--void)_60%,transparent)] py-5">
                {selectedPaymentMethod !== PaymentProviderType.PAYPAL ? (
                    <button
                        type="button"
                        disabled={isProcessing || !reservation}
                        onClick={() => handleCreateBooking()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--crimson)] px-5 py-4 text-center text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)] disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        {isProcessing && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}
                        {isProcessing
                            ? "Processing payment..."
                            : reservation 
                                ? `Pay ${formatEuro(reservation.totalAmount)}`
                                : "Loading..."}
                    </button>
                ) : (
                    <div className="w-full rounded-lg bg-[var(--gold)]/20 px-5 py-4 text-center text-sm font-semibold text-[var(--ink)]">
                        {paypalOrderId 
                            ? "✓ Payment completed" 
                            : "Complete your payment with PayPal above"}
                    </div>
                )}
            </div>
        </main>
    );
}
