import { PaymentProviderType } from "@/features/payments/api/paymentsApi";
import { CreatePaymentOrderParams, CaptureResult } from "./types";

export abstract class BasePaymentProvider {
  abstract readonly type: PaymentProviderType;

  abstract loadSdk(clientId: string): Promise<void>;
  abstract renderButton(containerId: string, params: CreatePaymentOrderParams): Promise<void>;
  abstract onApprove(callback: (data: CaptureResult) => void): void;
}
