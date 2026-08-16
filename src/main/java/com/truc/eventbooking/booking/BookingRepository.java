package com.truc.eventbooking.booking;

import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class BookingRepository {
    private final List<Booking> bookings = new ArrayList<Booking>();
    private final AtomicLong idGenerator = new AtomicLong(9000L);
    private final AtomicLong ticketSequence = new AtomicLong(1L);

    public List<Booking> findAll() {
        return bookings;
    }
    public Optional<Booking> FindByBookingId(Long bookingId) {
        return bookings.stream().filter(booking -> booking.getBookingID().equals(bookingId)).findFirst();
    }
    public Booking save(Long reservationid, Long customerId){
        Long bookingId = idGenerator.incrementAndGet();
        String ticketCode = ticketCodeGenerator(ticketSequence.incrementAndGet());
        Booking booking = new Booking(bookingId,reservationid, customerId, ticketCode);
        bookings.add(booking);
        return booking;
    }
    private String ticketCodeGenerator(Long sequence) {
        String date = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "TCK"+date+ "-" + String.format("%06d", sequence);
    }
}
