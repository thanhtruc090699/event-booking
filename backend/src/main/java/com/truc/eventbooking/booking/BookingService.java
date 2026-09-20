package com.truc.eventbooking.booking;

import com.truc.eventbooking.auth.AuthRepository;
import com.truc.eventbooking.auth.Customer;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.ForbiddenException;
import com.truc.eventbooking.payment.PaymentRepository;
import com.truc.eventbooking.payment.Payment;
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
import com.truc.eventbooking.booking.dto.CustomerBookingDto;
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
    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;
    private final AuthRepository authRepository;

    public BookingService(BookingRepository bookingRepository, ReservationRepository
            reservationRepository, PaymentRepository paymentRepository,
                          SeatService seatService, ReservationService reservationService, AuthRepository authRepository) {
        this.bookingRepository = bookingRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.reservationService = reservationService;
        this.authRepository = authRepository;
    }

    @Transactional
    public BookingDetailsDto createBooking(CreateBookingRequest request, Long customerId) {
        Long reservationId = request.reservationId();

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()-> new BusinessConflictException("RESERVATION_NOT_FOUND","Reservation not found"));

        if(!customerId.equals(reservation.getCustomer().getCustomerId())) {
            throw new ForbiddenException("RESERVATION_ACCESS_DENIED","You are not allowed to book this reservation");
        }

        Payment payment = paymentRepository.findByReservation_ReservationId(reservationId)
            .orElseThrow(() -> new BusinessConflictException("PAYMENT_NOT_FOUND", "Payment not found"));

        if (!payment.getStatus().equals(PaymentStatus.COMPLETED)) {
            reservationService.markAsCancelled(reservationId);
            throw new BusinessConflictException("PAYMENT_NOT_COMPLETED", "Payment has not been completed");
        }

        if (!payment.getReservation().getReservationId().equals(reservationId)) {
            throw new BusinessConflictException("PAYMENT_RESERVATION_MISMATCH", "Payment does not match reservation");
        }

        reservationService.markAsConfirmed(reservationId);
        String ticketCode = generatedTicketCode();
        Booking booking = new Booking(reservation, ticketCode);
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

    @Transactional
    public BookingDetailsDto getBookingDetailsById(Long bookingId, Long customerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new com.truc.eventbooking.common.exception.NotFoundException(
                        "BOOKING_NOT_FOUND",
                        "Booking not found"
                ));

        if (!booking.getReservation().getCustomer().getCustomerId().equals(customerId)) {
            throw new ForbiddenException(
                    "BOOKING_ACCESS_DENIED",
                    "You are not allowed to view this booking"
            );
        }

        Payment payment = paymentRepository
                .findByReservation_ReservationId(booking.getReservation().getReservationId())
                .orElseThrow(() -> new BusinessConflictException(
                        "PAYMENT_NOT_FOUND",
                        "Payment not found"
                ));

        return toBookingDetailsDto(booking, payment.getProvider().name());
    }
    
    public List<CustomerBookingDto> getBookingsByCustomerId(Long customerId) {
        Customer customer = authRepository.findById(customerId)
            .orElseThrow(() -> new com.truc.eventbooking.common.exception.NotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));
        
        List<Booking> bookings = bookingRepository.findByCustomer(customer);
        return bookings.stream().map(this::toCustomerBookingDto).toList();
    }
    
    @Transactional
    public CustomerBookingDto getBookingByTicketCode(String ticketReference, Long customerId) {
        Booking booking = bookingRepository.findByTicketCode(ticketReference)
                .orElseGet(() -> findBookingByLegacyId(ticketReference));

        if (!booking.getReservation().getCustomer().getCustomerId().equals(customerId)) {
            throw new ForbiddenException(
                    "TICKET_ACCESS_DENIED",
                    "You are not allowed to view this ticket"
            );
        }

        return toCustomerBookingDto(booking);
    }

    private Booking findBookingByLegacyId(String ticketReference) {
        try {
            return bookingRepository.findById(Long.parseLong(ticketReference))
                    .orElseThrow(() -> new com.truc.eventbooking.common.exception.NotFoundException(
                            "BOOKING_NOT_FOUND",
                            "Ticket not found"
                    ));
        } catch (NumberFormatException exception) {
            throw new com.truc.eventbooking.common.exception.NotFoundException(
                    "BOOKING_NOT_FOUND",
                    "Ticket not found"
            );
        }
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
    
    private CustomerBookingDto toCustomerBookingDto(Booking booking) {
        var reservation = booking.getReservation();
        var firstSeat = reservation.getReservationSeats().get(0);
        var seat = firstSeat.getSeat();
        var event = seat.getEvent();
        
        BigDecimal totalAmount = reservation.getReservationSeats().stream()
            .map(rs -> rs.getSeat().getSeatPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new CustomerBookingDto(
            booking.getBookingID(),
            booking.getTicketCode(),
            booking.getStatus(),
            totalAmount,
            booking.getCreatedAt(),
            new CustomerBookingDto.EventSummary(
                event.getName(),
                event.getImageUrl(),
                event.getVenueName(),
                event.getCity(),
                event.getStartTime()
            ),
            new CustomerBookingDto.SeatInfo(
                seat.getSection(),
                seat.getRowLabel(),
                seat.getSeatNumber()
            )
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
