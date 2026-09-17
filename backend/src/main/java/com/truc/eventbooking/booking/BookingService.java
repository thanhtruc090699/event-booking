package com.truc.eventbooking.booking;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.ForbiddenException;
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
import com.truc.eventbooking.booking.dto.BookingDetailsDto;
import com.truc.eventbooking.booking.dto.CreateBookingRequest;

import java.math.BigDecimal;
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
    public BookingDetailsDto createBooking(CreateBookingRequest request, Long customerId) {
        Long reservationId = request.reservationId();

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()-> new BusinessConflictException("RESERVATION_NOT_FOUND","Reservation not found"));

        if(customerId!=reservation.getCustomer().getCustomerId()) throw new ForbiddenException("RESERVATION_ACCESS_DENIED","You are not allowed to book this reservation");


        PaymentStatus paymentStatus = paymentService.pay(customerId, reservationId);
        if(paymentStatus!=PaymentStatus.SUCCEEDED){
            reservationService.markAsCancelled(reservationId);
            throw new BusinessConflictException("PAYMENT_FAILED","Payment failed");
        }

        reservationService.markAsConfirmed(reservationId);
        String ticketCode = generatedTicketCode();
        Booking booking = new Booking(reservation,ticketCode);
        Booking savedBooking = bookingRepository.save(booking);

        return toBookingDetailsDto(savedBooking, request.paymentMethod());
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
                null
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
    
    private BookingDetailsDto toBookingDetailsDto(Booking booking, String paymentMethod) {
        BigDecimal totalAmount = booking.getReservation().getReservationSeats().stream()
            .map(rs -> rs.getSeat().getSeatPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new BookingDetailsDto(
            booking.getBookingID(),
            booking.getTicketCode(),
            booking.getStatus(),
            totalAmount,
            booking.getCreatedAt(),
            paymentMethod,
            reservationService.getReservationSummaryById(booking.getReservation().getReservationId(), booking.getReservation().getCustomer().getCustomerId())
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
