package com.truc.eventbooking.booking.dto;

public record CreateBookingRequest (
        Long reservationId,
        Long customerId
){
}
