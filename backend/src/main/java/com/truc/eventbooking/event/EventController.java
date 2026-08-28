package com.truc.eventbooking.event;

import com.truc.eventbooking.event.dto.EventDetailResponse;
import com.truc.eventbooking.event.dto.EventSummaryResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<EventSummaryResponse> getEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{eventId}")
    public EventDetailResponse getEventById(@PathVariable Long eventId) {
        return eventService.getEventById(eventId);
    }
}
