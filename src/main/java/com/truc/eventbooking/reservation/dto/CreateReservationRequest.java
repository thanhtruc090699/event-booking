package com.truc.eventbooking.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record CreateReservationRequest (
        @NotNull Long eventSeatId
){
}
