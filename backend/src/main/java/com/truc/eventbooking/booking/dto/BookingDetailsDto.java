package com.truc.eventbooking.booking.dto;

import com.truc.eventbooking.booking.BookingStatus;
import com.truc.eventbooking.reservation.dto.ReservationSummaryResponse;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record BookingDetailsDto(
    Long id,
    String bookingReference,
    BookingStatus status,
    BigDecimal totalAmount,
    OffsetDateTime createdAt,
    String paymentMethod,
    ReservationSummaryResponse reservation
) {
}
