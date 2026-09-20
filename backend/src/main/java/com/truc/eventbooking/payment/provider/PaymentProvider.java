package com.truc.eventbooking.payment.provider;

import com.truc.eventbooking.payment.PaymentProviderType;

import java.math.BigDecimal;

public interface PaymentProvider {
PaymentProviderType getType();

String createOrder(
        BigDecimal amount,
        String currency
);

String captureOrder(String providerOrderId);
}
