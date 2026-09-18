package com.truc.eventbooking.payment.dto;

import com.truc.eventbooking.payment.PaymentProviderType;

public record CreatePaymentRequest(
        Long reservationId,
        PaymentProviderType paymentProviderType
) {
}
