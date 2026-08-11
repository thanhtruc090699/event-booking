package com.truc.eventbooking.event.dto;
import java.time.OffsetDateTime;

public record EventDetailResponse (
        Long id,
        String name,
        String description,
        String venueName,
        OffsetDateTime startTime
){
}
