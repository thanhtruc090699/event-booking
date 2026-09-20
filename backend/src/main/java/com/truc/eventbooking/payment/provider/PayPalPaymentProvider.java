package com.truc.eventbooking.payment.provider;

import com.truc.eventbooking.payment.Payment;
import com.truc.eventbooking.payment.PaymentProviderType;
import com.truc.eventbooking.payment.paypal.PayPalClient;

import java.math.BigDecimal;

public class PayPalPaymentProvider implements PaymentProvider {
    private final PayPalClient payPalClient;
    public PayPalPaymentProvider(PayPalClient payPalClient) {
        this.payPalClient = payPalClient;
    }

    @Override
    public PaymentProviderType getType() {
        return PaymentProviderType.PAYPAL;
    }

    @Override
    public String createOrder(
            BigDecimal amount,
            String currency
    ){
        return payPalClient.createOrder(amount, currency);
    }
}
