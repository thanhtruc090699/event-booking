package com.truc.eventbooking.event;

import com.truc.eventbooking.event.dto.EventDetailResponse;
import com.truc.eventbooking.event.dto.EventSummaryResponse;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    
    public EventService(EventRepository eventRepository, SeatRepository seatRepository) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
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
                event.getCity(),
                event.getStartTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                event.getImageUrl(),
                event.getCategory(),
                event.isHot()
        );
    }
    
    private EventDetailResponse toDetailResponse(Event event) {
        List<Seat> seats = seatRepository.findAllByEventId(event.getId());
        
        long availableSeats = seats.stream()
                .filter(seat -> seat.getSeatStatus() == SeatStatus.AVAILABLE)
                .count();
        
        BigDecimal startingPrice = seats.stream()
                .filter(seat -> seat.getSeatStatus() == SeatStatus.AVAILABLE)
                .map(Seat::getSeatPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        
        return new EventDetailResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getVenueName(),
                event.getCity(),
                event.getImageUrl(),
                event.getCategory(),
                event.getStartTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                startingPrice,
                (int) availableSeats
        );
    }
}
