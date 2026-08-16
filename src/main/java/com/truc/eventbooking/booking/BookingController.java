package com.truc.eventbooking.booking;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import com.truc.eventbooking.booking.dto.BookingResponse;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(@RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getBooking(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId);
    }
}
