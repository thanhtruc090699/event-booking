package com.truc.eventbooking.booking;

import com.truc.eventbooking.payment.MockPaymentService;
import com.truc.eventbooking.payment.PaymentStatus;
import com.truc.eventbooking.reservation.Reservation;
import com.truc.eventbooking.reservation.ReservationRepository;
import com.truc.eventbooking.reservation.ReservationStatus;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatService;
import com.truc.eventbooking.seat.SeatStatus;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.booking.dto.BookingResponse;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;
    private final MockPaymentService paymentService;
    private final SeatService seatService;
    public BookingService(BookingRepository bookingRepository, ReservationRepository
            reservationRepository, SeatRepository seatRepository, MockPaymentService paymentService,
                          SeatService seatService) {
        this.bookingRepository = bookingRepository;
        this.reservationRepository = reservationRepository;
        this.seatRepository = seatRepository;
        this.paymentService = paymentService;
        this.seatService = seatService;
    }

    public BookingResponse createBooking(CreateBookingRequest request) {
        Long reservationId = request.reservationId();
        Long customerId = request.customerId();

        Reservation reservation = reservationRepository.findByReservationId(reservationId).orElseThrow(()-> new RuntimeException("Reservation not found"));
        Long seatId = reservation.getSeatId();
        Seat seat = seatRepository.findBySeatId(seatId).orElseThrow(()-> new RuntimeException("Seat not found"));

        if(customerId!=reservation.getCustomerId()) throw new RuntimeException("Customer id mismatch");

        if(reservation.getStatus()!= ReservationStatus.ACTIVE) throw new RuntimeException("Reservation not active");

        if(reservation.getExpiryDate().isBefore(OffsetDateTime.now())){
            reservation.setStatus(ReservationStatus.EXPIRED);
            seat.setSeatStatus(SeatStatus.AVAILABLE);
            throw new RuntimeException("Reservation is expired");
        }

        if(seat.getSeatStatus() != SeatStatus.RESERVED) throw new RuntimeException("Seat is not reserved");

        PaymentStatus paymentStatus = paymentService.pay(request.customerId(), reservationId);
        if(paymentStatus!=PaymentStatus.SUCCEEDED){
            reservation.setStatus(ReservationStatus.CANCELLED);
            seatService.releaseSeat(seatId);
            throw new RuntimeException("Payment failed");
        }

        if(paymentStatus == PaymentStatus.SUCCEEDED){
            reservation.setStatus(ReservationStatus.CONFIRMED);
            seatService.markAsBooked(seatId);

        }
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
