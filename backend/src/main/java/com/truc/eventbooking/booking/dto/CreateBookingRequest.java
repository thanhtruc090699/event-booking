package com.truc.eventbooking.booking.dto;

import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest (
        @NotNull Long reservationId,
        String paymentMethod
){
}
