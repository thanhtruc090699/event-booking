import { apiClient } from "@/lib/api/apiClient";

export enum PaymentProviderType {
  PAYPAL = "PAYPAL",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

export type CreatePaymentOrderRequest = {
    reservationId: number;
    paymentProviderType: PaymentProviderType;
}

export type PaymentOrderResponse = {
    paymentId: number;
    providerOrderId: string;
}

export type PaymentDto = {
    id: number;
    provider: PaymentProviderType;
    providerOrderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
}

export function createPaymentOrder(payload: CreatePaymentOrderRequest, token: string){
    return apiClient<PaymentOrderResponse>("/api/payments/orders",{
        method: "POST",
        token,
        body: JSON.stringify(payload)
    });
}

export function capturePayment(paymentId: number, token: string) {
    return apiClient<void>(
        `/api/payments/${paymentId}/capture`,
        {
            method: "POST",
            token,
        }
    );
}




