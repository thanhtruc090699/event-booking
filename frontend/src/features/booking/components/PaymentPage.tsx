"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { TimerBanner } from "@/features/booking/components/TimerBanner";
import { createBooking, getReservation } from "@/features/booking/api/bookingApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatEuro } from "@/features/booking/data/mockBooking";
import {
    capturePayment,
    createPaymentOrder,
    PaymentProviderType,
} from "@/features/payments/api/paymentsApi";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

type PaymentReservation = {
    totalAmount: number;
    expiresAt: string;
};

export function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reservationId = searchParams.get("reservationId");
    const { accessToken } = useAuth();
    const paymentIdRef = useRef<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [reservation, setReservation] = useState<PaymentReservation | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    useEffect(() => {
        if (!reservationId || !accessToken) return;

        getReservation(reservationId, accessToken)
            .then((data) => {
                const totalAmount = data.selectedSeats.reduce(
                    (sum, seat) => sum + seat.price,
                    0
                );
                setReservation({ totalAmount, expiresAt: data.expiresAt });

                const now = new Date();
                const expiresAt = new Date(data.expiresAt);

                if (expiresAt <= now) {
                    router.push(`/booking/expired?reservationId=${reservationId}`);
                    return;
                }
            })
            .catch((error) => {
                console.error("Failed to fetch reservation:", error);
                setPaymentError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load the reservation."
                );
            });
    }, [reservationId, accessToken, router]);

    async function createPayPalOrder() {
        if (!reservationId || !accessToken) {
            throw new Error("Missing reservation or authentication.");
        }

        setPaymentError(null);
        const payment = await createPaymentOrder(
            {
                reservationId: Number(reservationId),
                paymentProviderType: PaymentProviderType.PAYPAL,
            },
            accessToken
        );

        paymentIdRef.current = payment.paymentId;
        return payment.providerOrderId;
    }

    async function approvePayPalOrder() {
        if (!reservationId || !accessToken || paymentIdRef.current === null) {
            throw new Error("PayPal payment session is missing.");
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            await capturePayment(paymentIdRef.current, accessToken);

            const booking = await createBooking(
                {
                    reservationId: Number(reservationId),
                    paymentMethod: "PAYPAL",
                },
                accessToken
            );

            router.push(`/booking/confirmation?bookingId=${booking.id}`);
        } catch (error) {
            console.error("PayPal payment failed:", error);
            setPaymentError(
                error instanceof Error
                    ? error.message
                    : "PayPal payment failed. Please try again."
            );
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }

    if (!reservationId || !accessToken) {
        return (
            <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
                <div className="text-center">
                    <p className="text-[var(--muted)]">Please login to continue</p>
                    <Link
                        href={`/login?redirect=/booking/payment?reservationId=${reservationId}`}
                        className="mt-4 inline-block text-[var(--gold)]"
                    >
                        Login →
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-[640px] px-6 pb-24 pt-7">
            <Link
                href={`/booking/checkout?reservationId=${reservationId}`}
                className="mb-2 block text-sm text-[var(--muted)] hover:text-[var(--ink)]"
            >
                ← Back to checkout
            </Link>

            <h1 className="mb-[18px] font-[var(--font-bebas)] text-[32px] tracking-wide text-[var(--ink)]">
                Payment
            </h1>

            <TimerBanner
                label="Reservation expires in"
                expiresAt={reservation?.expiresAt ?? ""}
                onExpire={() => {
                    router.push(`/booking/expired?reservationId=${reservationId}`);
                }}
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

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[18px]">
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Payment method
                </h2>
                <p className="mb-5 text-sm font-semibold text-[var(--ink)]">PayPal</p>

                {!PAYPAL_CLIENT_ID && (
                    <p className="rounded-lg border border-[var(--crimson)] bg-[rgba(255,61,87,0.08)] p-3 text-sm text-[var(--crimson)]">
                        PayPal client ID is not configured.
                    </p>
                )}

                {PAYPAL_CLIENT_ID && reservation && (
                    <PayPalScriptProvider
                        options={{
                            clientId: PAYPAL_CLIENT_ID,
                            currency: "EUR",
                            intent: "capture",
                        }}
                    >
                        <PayPalButtons
                            disabled={isProcessing}
                            createOrder={createPayPalOrder}
                            onApprove={approvePayPalOrder}
                            onCancel={() => setPaymentError("PayPal checkout was cancelled.")}
                            onError={(error) => {
                                console.error("PayPal SDK error:", error);
                                setPaymentError("PayPal could not complete the payment.");
                            }}
                            style={{ layout: "vertical", shape: "rect", label: "paypal" }}
                        />
                    </PayPalScriptProvider>
                )}

                {paymentError && (
                    <p className="mt-3 rounded-lg border border-[var(--crimson)] bg-[rgba(255,61,87,0.08)] p-3 text-sm text-[var(--crimson)]">
                        {paymentError}
                    </p>
                )}

                <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                    PayPal securely handles your login and payment details. StagePass
                    does not receive your PayPal password or card information.
                </p>
            </section>
        </main>
    );
}
