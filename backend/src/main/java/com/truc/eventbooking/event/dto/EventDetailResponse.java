package com.truc.eventbooking.event.dto;

import java.math.BigDecimal;

public record EventDetailResponse(
        Long id,
        String title,
        String description,
        String venue,
        String city,
        String imageUrl,
        String category,
        String startDate,
        BigDecimal startingPrice,
        int availableSeats
) {
}
