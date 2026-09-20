"use client";

import { createContext, useContext, ReactNode } from "react";
import { PaymentProviderType } from "@/features/payments/api/paymentsApi";
import { PayPalProvider } from "@/features/payments/providers/PaypalProvider";
import { PaymentProvider } from "@/features/payments/providers/types";

const providers: Record<PaymentProviderType, PaymentProvider> = {
  [PaymentProviderType.PAYPAL]: new PayPalProvider(),
  [PaymentProviderType.STRIPE]: null as any,
};

const PaymentContext = createContext<Record<PaymentProviderType, PaymentProvider>>(
  {} as Record<PaymentProviderType, PaymentProvider>
);

export function PaymentProviderGroup({ children }: { children: ReactNode }) {
  return (
    <PaymentContext.Provider value={providers}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentProviders() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentProviders must be used within PaymentProviderGroup");
  }
  return context;
}

export function usePaymentProvider(type: PaymentProviderType) {
  const providers = usePaymentProviders();
  return providers[type];
}
