package com.truc.eventbooking.event.dto;

import java.time.OffsetDateTime;

public record EventSummaryResponse(
        Long id,
        String title,
        String venue,
        String city,
        String startDate,
        String imageUrl,
        String category,
        boolean hot
) {
}