package com.truc.eventbooking.seat;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
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
    public EventSeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()->new NotFoundException(
                "SEAT_NOT_FOUND","Seat not found"));
        return toEventSeatResponse(seat);
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
       Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new NotFoundException("SEAT_NOT_FOUND", "Seat not found"));
       if(seat.getSeatStatus()!=SeatStatus.RESERVED) throw new BusinessConflictException("SEAT_NOT_REVERSED", "Seat not reversed");

       seat.setSeatStatus(SeatStatus.AVAILABLE);
       return seat;
    }
    public Seat markAsReserved(Long seatId) {
        Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new NotFoundException("SEAT_NOT_FOUND", "Seat not found"));
        if(seat.getSeatStatus()!=SeatStatus.AVAILABLE) throw new BusinessConflictException("SEAT_NOT_AVAILABLE", "Seat not available");
        seat.setSeatStatus(SeatStatus.RESERVED);
        return seat;
    }
    public Seat markAsBooked(Long seatId) {
        Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new NotFoundException("SEAT_NOT_FOUND", "Seat not found"));

        if (seat.getSeatStatus()!=SeatStatus.RESERVED) throw new BusinessConflictException("SEAT_NOT_REVERSED", "Seat not reversed");

        seat.setSeatStatus(SeatStatus.BOOKED);
        return seat;
    }
}
