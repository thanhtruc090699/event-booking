"use client";

import { PaymentProviderType } from "@/features/payments/api/paymentsApi";

type PaymentMethodInfo = {
  type: PaymentProviderType;
  label: string;
};

const paymentMethods: PaymentMethodInfo[] = [
  { type: PaymentProviderType.PAYPAL, label: "PayPal" },
];

type Props = {
  selected: PaymentProviderType | null;
  onSelect: (type: PaymentProviderType) => void;
};

export function PaymentMethodList({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-4 flex-wrap">
      {paymentMethods.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-3 border rounded-lg transition-colors ${
            selected === type
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
