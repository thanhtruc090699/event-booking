package com.truc.eventbooking.payment.dto;

public record PayPalOrderResponse(
        Long paymentId,
        String paypalOrderId
) {
}
