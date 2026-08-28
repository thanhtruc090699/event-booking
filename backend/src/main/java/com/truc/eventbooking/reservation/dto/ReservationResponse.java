package com.truc.eventbooking.reservation.dto;

import com.truc.eventbooking.reservation.ReservationStatus;

import java.time.OffsetDateTime;

public record ReservationResponse(
        Long reservationId,
        Long eventSeatId,
        Long customerId,
        ReservationStatus reservationStatus,
        OffsetDateTime expiresAt
) {
}
