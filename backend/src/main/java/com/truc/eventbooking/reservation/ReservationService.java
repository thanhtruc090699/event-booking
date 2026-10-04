package com.truc.eventbooking.reservation;

import com.truc.eventbooking.auth.AuthRepository;
import com.truc.eventbooking.auth.Customer;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.event.Event;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
import com.truc.eventbooking.reservation.dto.ReservationResponse;
import com.truc.eventbooking.reservation.dto.ReservationSummaryResponse;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final SeatService seatService;
    private final AuthRepository authRepository;
    
    public ReservationService(ReservationRepository reservationRepository,
                              SeatService seatService,
                              AuthRepository  authRepository) {
        this.reservationRepository = reservationRepository;
        this.seatService = seatService;
        this.authRepository = authRepository;
    }
    
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::toReservationResponse).toList();
    }
    
    public ReservationResponse getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId).map(this::toReservationResponse).orElseThrow(()-> new RuntimeException("Reservation not found"));
    }

    @Transactional
    public ReservationSummaryResponse createReservation(CreateReservationRequest request, Long customerId) {
        Customer customer = authRepository.findById(customerId).orElseThrow(
                () -> new NotFoundException("CUSTOMER_NOT_FOUND", "Customer not found")
        );

        Reservation reservation = new Reservation(customer);
        Event reservationEvent = null;

        // Mark each seat as reserved and add to reservation.
        // The transaction rolls back every seat locked so far if one of them
        // turns out to belong to a different event.
        for (Long seatId : request.seatIds()) {
            Seat seat = seatService.markAsReserved(seatId);
            if (reservationEvent == null) {
                reservationEvent = seat.getEvent();
            } else if (!reservationEvent.getId().equals(seat.getEvent().getId())) {
                throw new BusinessConflictException(
                        "SEATS_SPAN_MULTIPLE_EVENTS",
                        "All seats in a reservation must belong to the same event"
                );
            }
            reservation.addSeat(seat);
        }

        Reservation savedReservation = reservationRepository.save(reservation);
        return toReservationSummaryResponse(savedReservation);
    }
    
    @Transactional
    public ReservationSummaryResponse getReservationSummaryById(Long reservationId, Long customerId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new NotFoundException("RESERVATION_NOT_FOUND", "Reservation not found"));

        if (reservation.getStatus()==ReservationStatus.ACTIVE && reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
            markAsExpired(reservationId);
            throw new BusinessConflictException(
                    "RESERVATION_EXPIRED", "Reservation is expired"
            );
        }
        
        // Check ownership - only allow customer to view their own reservation
        if (!reservation.getCustomer().getCustomerId().equals(customerId)) {
            throw new BusinessConflictException("NOT_OWNER", "You don't own this reservation");
        }
        
        return toReservationSummaryResponse(reservation);
    }
    
    public Reservation markAsCancelled(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new NotFoundException(
                "RESERVATION_NOT_FOUND", "Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");

        // Release all seats
        for (ReservationSeat rs : reservation.getReservationSeats()) {
            seatService.releaseSeat(rs.getSeat().getSeatId());
        }
        
        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservation;
    }
    
    public Reservation markAsConfirmed(Long reservationId){
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new NotFoundException(
                "RESERVATION_NOT_FOUND", "Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");

        if(reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
            markAsExpired(reservationId);
            throw new BusinessConflictException("RESERVATION_EXPIRED","Reservation is expired");
        }

        // Mark all seats as booked
        for (ReservationSeat rs : reservation.getReservationSeats()) {
            seatService.markAsBooked(rs.getSeat().getSeatId());
        }
        
        reservation.setStatus(ReservationStatus.CONFIRMED);
        return reservation;
    }
    
    public Reservation markAsExpired(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(()-> new NotFoundException(
                "RESERVATION_NOT_FOUND","Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");
        if (!reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
            throw new BusinessConflictException("RESERVATION_NOT_EXPIRED", "Reservation is not expired");
        }
        
        // Release all seats
        for (ReservationSeat rs : reservation.getReservationSeats()) {
            seatService.releaseSeat(rs.getSeat().getSeatId());
        }
        
        reservation.setStatus(ReservationStatus.EXPIRED);
        return reservation;
    }
    
    private ReservationResponse toReservationResponse(Reservation reservation) {
        // For backward compatibility - return first seat only
        if (reservation.getReservationSeats().isEmpty()) {
            return null;
        }
        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getReservationSeats().get(0).getSeat().getSeatId(),
                reservation.getCustomer().getCustomerId(),
                reservation.getStatus(),
                reservation.getExpiryDate()
        );
    }
    
    private ReservationSummaryResponse toReservationSummaryResponse(Reservation reservation) {
        // Build EventInfo from first seat (all seats belong to same event)
        ReservationSeat firstSeat = reservation.getReservationSeats().get(0);
        Seat seat = firstSeat.getSeat();
        
        ReservationSummaryResponse.EventInfo eventInfo = new ReservationSummaryResponse.EventInfo(
            seat.getEvent().getId(),
            seat.getEvent().getName(),
            seat.getEvent().getImageUrl(),
            seat.getEvent().getVenueName(),
            seat.getEvent().getCity(),
            seat.getEvent().getStartTime()
        );
        
        // Build list of SeatInfo
        List<ReservationSummaryResponse.SeatInfo> seatInfos = new ArrayList<>();
        for (ReservationSeat rs : reservation.getReservationSeats()) {
            Seat s = rs.getSeat();
            seatInfos.add(new ReservationSummaryResponse.SeatInfo(
                s.getSeatId(),
                s.getSection(),
                s.getRowLabel(),
                s.getSeatNumber(),
                s.getSeatPrice()
            ));
        }
        
        return new ReservationSummaryResponse(
            reservation.getReservationId(),
            seat.getEvent().getId(),
            reservation.getStatus(),
            reservation.getExpiryDate(),
            eventInfo,
            seatInfos
        );
    }
}
