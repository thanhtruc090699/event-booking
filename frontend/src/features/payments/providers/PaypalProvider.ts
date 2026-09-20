import { BasePaymentProvider } from "./PaymentProvider";
import { PaymentProviderType } from "@/features/payments/api/paymentsApi";
import { CreatePaymentOrderParams, CaptureResult } from "./types";

export class PayPalProvider extends BasePaymentProvider {
  readonly type = PaymentProviderType.PAYPAL;
  private sdkLoaded = false;

  async loadSdk(clientId: string) {
    if (this.sdkLoaded) return;

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async renderButton(containerId: string, params: CreatePaymentOrderParams): Promise<void> {
    const container = document.getElementById(containerId);
    if (!container) return;

    const paypal = (window as any).paypal;
    if (!paypal) {
      throw new Error("PayPal SDK not loaded");
    }

    this.onApproveCallback = null;
    
    paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: params.amount.toFixed(2),
                currency_code: params.currency || "USD",
              },
            },
          ],
        });
      },
      onApprove: (_data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          const result: CaptureResult = {
            success: true,
            orderId: details.id,
            captureId:
              details.purchase_units?.[0]?.payments?.captures?.[0]?.id,
          };
          if (this.onApproveCallback) {
            this.onApproveCallback(result);
          }
        });
      },
    }).render(containerId);
  }

  private onApproveCallback: ((data: CaptureResult) => void) | null = null;

  onApprove(callback: (data: CaptureResult) => void) {
    this.onApproveCallback = callback;
  }
}
