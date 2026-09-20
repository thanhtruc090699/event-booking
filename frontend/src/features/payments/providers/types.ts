import { PaymentProviderType } from "@/features/payments/api/paymentsApi";

export type CreatePaymentOrderParams = {
  amount: number;
  currency?: string;
};

export type CaptureResult = {
  success: boolean;
  orderId: string;
  captureId?: string;
};

export interface PaymentProvider {
  readonly type: PaymentProviderType;
  loadSdk(clientId: string): Promise<void>;
  renderButton(containerId: string, params: CreatePaymentOrderParams): Promise<void>;
  onApprove(callback: (data: CaptureResult) => void): void;
}
