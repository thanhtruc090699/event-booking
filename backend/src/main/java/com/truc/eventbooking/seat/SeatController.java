package com.truc.eventbooking.seat;

import com.truc.eventbooking.seat.dto.EventSeatResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/seats")
public class SeatController {

    private final SeatService seatService;
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<EventSeatResponse> getAllSeatsByEventId(@PathVariable Long eventId){
        return seatService.getAllSeatsByEventId(eventId);
    }
}
