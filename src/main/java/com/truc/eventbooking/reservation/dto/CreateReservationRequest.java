package com.truc.eventbooking.reservation.dto;

public record CreateReservationRequest (
        Long eventSeatId,
        Long customerId
){
}
