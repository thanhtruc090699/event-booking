package com.truc.eventbooking.reservation.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateReservationRequest (
    @NotEmpty(message = "At least one seat must be selected")
    List<Long> seatIds
){
}
