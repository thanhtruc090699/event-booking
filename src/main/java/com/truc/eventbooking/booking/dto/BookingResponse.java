package com.truc.eventbooking.booking.dto;

import com.truc.eventbooking.booking.BookingStatus;

public record BookingResponse (
        Long bookingId,
        Long reservationId,
        BookingStatus status,
        String ticketCode
){
}
