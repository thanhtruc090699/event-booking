package com.truc.eventbooking.seat;
import com.truc.eventbooking.event.Event;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class SeatRepository {
    private final List<Seat> seats = List.of(
            new Seat(
                    1L,
                    1001L,
                    "A",
                    "1",
                    "12",
                    49.99,
                    SeatStatus.AVAILABLE
            ),
            new Seat(
                    1L,
                    1002L,
                    "A",
                    "1",
                    "13",
                    49.99,
                    SeatStatus.AVAILABLE
            ),
            new Seat(
                    1L,
                    1003L,
                    "A",
                    "1",
                    "14",
                    59.99,
                    SeatStatus.BOOKED
            ),
            new Seat(
                    2L,
                    2001L,
                    "B",
                    "2",
                    "01",
                    99.00,
                    SeatStatus.AVAILABLE
            )
    );

    public List<Seat> findAllByEventId(Long eventId) {
       return seats.stream().filter(seat -> seat.getEventId().equals(eventId)).toList();
    }
    public Optional<Seat> findByEventIdAndSeatId(Long eventId, Long seatId) {
        return seats.stream().filter(seat -> seat.getEventId().equals(eventId) && seat.getSeatId().equals(seatId)).findFirst();
    }
    public Optional<Seat> findBySeatId(Long seatId) {
        return seats.stream().filter(seat -> seat.getSeatId().equals(seatId)).findFirst();
    }

}
