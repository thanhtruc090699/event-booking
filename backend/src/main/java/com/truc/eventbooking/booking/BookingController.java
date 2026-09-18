package com.truc.eventbooking.booking;

import com.truc.eventbooking.security.CustomerUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.truc.eventbooking.booking.dto.BookingResponse;
import com.truc.eventbooking.booking.dto.BookingDetailsDto;
import com.truc.eventbooking.booking.dto.CustomerBookingDto;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.util.List;

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
    public BookingDetailsDto createBooking(@Valid @RequestBody CreateBookingRequest request,
                                         @AuthenticationPrincipal CustomerUserPrincipal principal) {
        return bookingService.createBooking(request,principal.getCustomerId());
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getBooking(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId);
    }
    
    @GetMapping("/customer/me")
    public List<CustomerBookingDto> getMyBookings(@AuthenticationPrincipal CustomerUserPrincipal principal) {
        return bookingService.getBookingsByCustomerId(principal.getCustomerId());
    }
    
    @GetMapping("/ticket/{ticketCode}")
    public CustomerBookingDto getTicketByCode(@PathVariable String ticketCode) {
        return bookingService.getBookingByTicketCode(ticketCode);
    }
}
