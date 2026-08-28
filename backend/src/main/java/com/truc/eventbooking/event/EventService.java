package com.truc.eventbooking.event;

import com.truc.eventbooking.event.dto.EventDetailResponse;
import com.truc.eventbooking.event.dto.EventSummaryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }
    public List<EventSummaryResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }
    public EventDetailResponse getEventById(Long id) {
        return eventRepository.findById(id).map(this::toDetailResponse)
                .orElseThrow(()-> new RuntimeException("Event Not Found"));
    }
    private EventSummaryResponse toSummaryResponse(Event event) {
        return new EventSummaryResponse(
                event.getId(),
                event.getName(),
                event.getVenueName(),
                event.getStartTime()
        );
    }
    private EventDetailResponse toDetailResponse(Event event) {
        return new EventDetailResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getVenueName(),
                event.getStartTime()
        );
    }
}
