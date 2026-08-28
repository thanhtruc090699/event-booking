package com.truc.eventbooking.event.dto;

import java.time.OffsetDateTime;

public record EventSummaryResponse(
        Long id,
        String name,
        String venueName,
        OffsetDateTime startTime
) {
}