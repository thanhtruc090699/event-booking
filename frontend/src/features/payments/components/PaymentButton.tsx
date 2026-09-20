"use client";

import { useEffect, useRef } from "react";
import { usePayment } from "@/features/payments/hooks/usePayment";
import { PaymentProviderType } from "@/features/payments/api/paymentsApi";

type Props = {
  providerType: PaymentProviderType;
  clientId: string;
  amount: number;
  currency?: string;
  onSuccess: (orderId: string, captureId: string) => void;
};

export function PaymentButton({
  providerType,
  clientId,
  amount,
  currency,
  onSuccess,
}: Props) {
  const containerId = `paypal-button-container`;
  const { loadSdk, renderButton, onApprove } = usePayment(providerType);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadSdk(clientId)
      .then(() => {
        onApprove((data) => {
          if (data.success && data.captureId) {
            onSuccess(data.orderId, data.captureId);
          }
        });
        renderButton(containerId, { amount, currency });
      })
      .catch((error) => {
        console.error("Failed to load PayPal SDK:", error);
      });
  }, [loadSdk, renderButton, onApprove, amount, currency, clientId, onSuccess]);

  return <div id={containerId} className="w-full flex justify-center" />;
}
