package com.truc.eventbooking;

import com.truc.eventbooking.auth.AuthRepository;
import com.truc.eventbooking.auth.Customer;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.event.Event;
import com.truc.eventbooking.event.EventRepository;
import com.truc.eventbooking.event.EventService;
import com.truc.eventbooking.reservation.ReservationRepository;
import com.truc.eventbooking.reservation.ReservationService;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class EventBookingGuardsTests {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private AuthRepository authRepository;

    @Test
    void createReservationRejectsSeatsFromDifferentEvents() {
        Event first = saveEvent("Berlin");
        Event second = saveEvent("Munich");
        Seat firstSeat = saveSeat(first);
        Seat secondSeat = saveSeat(second);
        Customer customer = saveCustomer();

        List<Long> seatIds = List.of(firstSeat.getSeatId(), secondSeat.getSeatId());
        CreateReservationRequest request = new CreateReservationRequest(seatIds);

        BusinessConflictException exception = assertThrows(
                BusinessConflictException.class,
                () -> reservationService.createReservation(request, customer.getCustomerId())
        );

        assertEquals("SEATS_SPAN_MULTIPLE_EVENTS", exception.getCode());
    }

    @Test
    void rejectedMultiEventReservationLeavesEverySeatAvailable() {
        Event first = saveEvent("Hamburg");
        Event second = saveEvent("Cologne");
        Seat firstSeat = saveSeat(first);
        Seat secondSeat = saveSeat(second);
        Customer customer = saveCustomer();

        long reservationsBefore = reservationRepository.count();

        CreateReservationRequest request = new CreateReservationRequest(
                List.of(firstSeat.getSeatId(), secondSeat.getSeatId())
        );
        assertThrows(BusinessConflictException.class,
                () -> reservationService.createReservation(request, customer.getCustomerId()));

        assertEquals(reservationsBefore, reservationRepository.count());
        assertEquals(SeatStatus.AVAILABLE, seatRepository.findById(firstSeat.getSeatId()).orElseThrow().getSeatStatus());
        assertEquals(SeatStatus.AVAILABLE, seatRepository.findById(secondSeat.getSeatId()).orElseThrow().getSeatStatus());
    }

    @Test
    void createReservationAcceptsSeatsFromTheSameEvent() {
        Event event = saveEvent("Frankfurt");
        Seat firstSeat = saveSeat(event);
        Seat secondSeat = saveSeat(event);
        Customer customer = saveCustomer();

        CreateReservationRequest request = new CreateReservationRequest(
                List.of(firstSeat.getSeatId(), secondSeat.getSeatId())
        );

        var summary = reservationService.createReservation(request, customer.getCustomerId());

        assertEquals(2, summary.selectedSeats().size());
        assertEquals(event.getId(), summary.eventId());
    }

    @Test
    void getEventByIdThrowsNotFoundForUnknownId() {
        long unknownId = eventRepository.findAll().stream()
                .map(Event::getId)
                .max(Long::compareTo)
                .orElse(0L) + 1000L;

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> eventService.getEventById(unknownId)
        );

        assertEquals("EVENT_NOT_FOUND", exception.getCode());
    }

    private Event saveEvent(String city) {
        return eventRepository.save(new Event(
                "Event in " + city,
                "Test event",
                city + " Arena",
                OffsetDateTime.now().plusDays(30),
                city,
                "Concert",
                "https://picsum.photos/seed/" + city + "/480/270",
                false
        ));
    }

    private Seat saveSeat(Event event) {
        return seatRepository.save(new Seat(
                event, "A", "1", "01", BigDecimal.valueOf(49.99), SeatStatus.AVAILABLE
        ));
    }

    private Customer saveCustomer() {
        String email = "guard-" + System.nanoTime() + "@example.com";
        return authRepository.save(new Customer(email, "hashed", "Guard Test"));
    }
}
