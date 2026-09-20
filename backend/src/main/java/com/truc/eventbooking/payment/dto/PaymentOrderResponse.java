package com.truc.eventbooking.payment.dto;

public record PaymentOrderResponse(
        Long paymentId,
        String providerOrderId
) {
}
