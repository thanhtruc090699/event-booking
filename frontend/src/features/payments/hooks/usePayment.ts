import { useCallback } from "react";
import { usePaymentProvider } from "@/features/payments/context/PaymentContext";
import { PaymentProviderType } from "@/features/payments/api/paymentsApi";
import { CreatePaymentOrderParams, CaptureResult } from "@/features/payments/providers/types";

export function usePayment(providerType: PaymentProviderType) {
  const provider = usePaymentProvider(providerType);

  const loadSdk = useCallback(
    (clientId: string) => {
      return provider.loadSdk(clientId);
    },
    [provider]
  );

  const renderButton = useCallback(
    (containerId: string, params: CreatePaymentOrderParams) => {
      return provider.renderButton(containerId, params);
    },
    [provider]
  );

  const onApprove = useCallback(
    (callback: (data: CaptureResult) => void) => {
      provider.onApprove(callback);
    },
    [provider]
  );

  return { loadSdk, renderButton, onApprove, type: provider.type };
}
