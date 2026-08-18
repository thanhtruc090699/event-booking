package com.truc.eventbooking.booking;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.payment.MockPaymentService;
import com.truc.eventbooking.payment.PaymentStatus;
import com.truc.eventbooking.reservation.Reservation;
import com.truc.eventbooking.reservation.ReservationRepository;
import com.truc.eventbooking.reservation.ReservationService;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.booking.dto.BookingResponse;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

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

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        Long reservationId = request.reservationId();
        Long customerId = request.customerId();

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()-> new RuntimeException("Reservation not found"));

        if(customerId!=reservation.getCustomerId()) throw new BusinessConflictException("Customer_ID_MISMATCH","Customer id mismatch");


        PaymentStatus paymentStatus = paymentService.pay(request.customerId(), reservationId);
        if(paymentStatus!=PaymentStatus.SUCCEEDED){
            reservationService.markAsCancelled(reservationId);
            throw new BusinessConflictException("PAYMENT_FAILED","Payment failed");
        }

        reservationService.markAsConfirmed(reservationId);
        String ticketCode = generatedTicketCode();
        Booking booking = new Booking(reservation,customerId,ticketCode);
        Booking savedBooking = bookingRepository.save(booking);

        return toBookingResponse(savedBooking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toBookingResponse).toList();
    }

    public BookingResponse getBookingById(Long bookingid){
        Booking booking = bookingRepository.findById(bookingid).orElseThrow(()-> new RuntimeException("Booking not found"));
        return toBookingResponse(booking);
    }

    private CreateBookingRequest toCreateBookingRequest(Booking booking) {
        return new CreateBookingRequest(
                booking.getReservation().getReservationId(),
                booking.getCustomerID()
        );
    }
    private BookingResponse toBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingID(),
                booking.getReservation().getReservationId(),
                booking.getStatus(),
                booking.getTicketCode()
        );
    }

    private String generatedTicketCode() {
        String date = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String randomPart = UUID.randomUUID()
                .toString()
                .replace("-","")
                .substring(0,6)
                .toUpperCase();
        return "TCK" + date + randomPart;
    }
}
