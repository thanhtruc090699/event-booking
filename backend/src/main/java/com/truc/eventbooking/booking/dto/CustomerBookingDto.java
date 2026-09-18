package com.truc.eventbooking.booking.dto;

import com.truc.eventbooking.booking.BookingStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CustomerBookingDto(
    Long id,
    String bookingReference,
    BookingStatus status,
    BigDecimal totalAmount,
    OffsetDateTime createdAt,
    EventSummary event,
    SeatInfo seat
) {
    public record EventSummary(
        String title,
        String imageUrl,
        String venue,
        String city,
        OffsetDateTime startDate
    ) {}
    
    public record SeatInfo(
        String section,
        String rowLabel,
        String seatNumber
    ) {}
}
