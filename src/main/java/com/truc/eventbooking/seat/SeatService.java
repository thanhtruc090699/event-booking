package com.truc.eventbooking.seat;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.seat.dto.EventSeatResponse;

import java.util.List;

@Service
public class SeatService {
    private final SeatRepository seatRepository;
    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }
    public List<EventSeatResponse> getAllSeatsByEventId(Long eventId) {
        return seatRepository.findAllByEventId(eventId).stream()
                .map(this::toEventSeatResponse).toList();
    }
    private EventSeatResponse toEventSeatResponse(Seat seat) {
        return new EventSeatResponse(
                seat.getSeatId(),
                seat.getSection(),
                seat.getRowLabel(),
                seat.getSeatNumber(),
                seat.getSeatPrice(),
                seat.getSeatStatus()
        );
    }
    public Seat releaseSeat(Long seatId) {
       Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new RuntimeException("Seat not found"));
       if(seat.getSeatStatus()==SeatStatus.RESERVED) seat.setSeatStatus(SeatStatus.AVAILABLE);
       return seat;
    }
    public Seat markAsBooked(Long seatId) {
        Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new RuntimeException("Seat not found"));
        if (seat.getSeatStatus()==SeatStatus.RESERVED) seat.setSeatStatus(SeatStatus.BOOKED);
        return seat;
    }
}
