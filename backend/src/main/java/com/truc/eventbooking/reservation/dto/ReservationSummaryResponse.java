package com.truc.eventbooking.reservation.dto;

import com.truc.eventbooking.reservation.ReservationStatus;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record ReservationSummaryResponse(
    Long id,
    Long eventId,
    ReservationStatus status,
    OffsetDateTime expiresAt,
    
    EventInfo event,
    List<SeatInfo> selectedSeats
) {
    public record EventInfo(
        Long id,
        String title,
        String imageUrl,
        String venue,
        String city,
        OffsetDateTime startDate
    ) {}
    
    public record SeatInfo(
        Long id,
        String section,
        String rowLabel,
        String seatNumber,
        BigDecimal price
    ) {}
}
