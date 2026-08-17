package com.truc.eventbooking.booking;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.payment.MockPaymentService;
import com.truc.eventbooking.payment.PaymentStatus;
import com.truc.eventbooking.reservation.Reservation;
import com.truc.eventbooking.reservation.ReservationRepository;
import com.truc.eventbooking.reservation.ReservationService;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatService;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.booking.dto.BookingResponse;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ReservationRepository reservationRepository;
    private final MockPaymentService paymentService;
    private final ReservationService reservationService;

    public BookingService(BookingRepository bookingRepository, ReservationRepository
            reservationRepository, SeatRepository seatRepository, MockPaymentService paymentService,
                          SeatService seatService, ReservationService reservationService) {
        this.bookingRepository = bookingRepository;
        this.reservationRepository = reservationRepository;
        this.paymentService = paymentService;
        this.reservationService = reservationService;
    }

    public BookingResponse createBooking(CreateBookingRequest request) {
        Long reservationId = request.reservationId();
        Long customerId = request.customerId();

        Reservation reservation = reservationRepository.findByReservationId(reservationId).orElseThrow(()-> new RuntimeException("Reservation not found"));

        if(customerId!=reservation.getCustomerId()) throw new BusinessConflictException("Customer_ID_MISMATCH","Customer id mismatch");


        PaymentStatus paymentStatus = paymentService.pay(request.customerId(), reservationId);
        if(paymentStatus!=PaymentStatus.SUCCEEDED){
            reservationService.markAsCancelled(reservationId);
            throw new BusinessConflictException("PAYMENT_FAILED","Payment failed");
        }

        reservationService.markAsConfirmed(reservationId);
        Booking booking = bookingRepository.save(reservationId, customerId);

        return toBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toBookingResponse).toList();
    }

    public BookingResponse getBookingById(Long bookingid){
        Booking booking = bookingRepository.FindByBookingId(bookingid).orElseThrow(()-> new RuntimeException("Booking not found"));
        return toBookingResponse(booking);
    }

    private CreateBookingRequest toCreateBookingRequest(Booking booking) {
        return new CreateBookingRequest(
                booking.getReservationID(),
                booking.getCustomerID()
        );
    }
    private BookingResponse toBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingID(),
                booking.getReservationID(),
                booking.getStatus(),
                booking.getTicketCode()
        );
    }
}
