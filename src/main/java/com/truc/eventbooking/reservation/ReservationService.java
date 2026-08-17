package com.truc.eventbooking.reservation;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatService;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
import com.truc.eventbooking.reservation.dto.ReservationResponse;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final SeatService seatService;
    public ReservationService(ReservationRepository reservationRepository, SeatRepository seatRepository, SeatService seatService) {
        this.reservationRepository = reservationRepository;
        this.seatService = seatService;
    }
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::toReservationResponse).toList();
    }
    public ReservationResponse getReservationById(Long reservationId) {
        return reservationRepository.findByReservationId(reservationId).map(this::toReservationResponse).orElseThrow(()-> new RuntimeException("Reservation not found"));

    }
    public ReservationResponse getReservationBySeatId(Long seatId) {
        return reservationRepository.findBySeatId(seatId).map(this::toReservationResponse).orElseThrow(()-> new RuntimeException("Reservation not found"));
    }
    public ReservationResponse createReservation(CreateReservationRequest createReservationRequest) {
        Long seatId = createReservationRequest.eventSeatId();

        seatService.markAsReserved(seatId);

        Reservation reservation = reservationRepository.save(createReservationRequest.eventSeatId(), createReservationRequest.customerId());
        return toReservationResponse(reservation);
    }
    public Reservation markAsCancelled(Long reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId).orElseThrow(() -> new NotFoundException(
                "RESERVATION_NOT_FOUND", "Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");


        reservation.setStatus(ReservationStatus.CANCELLED);
        seatService.releaseSeat(reservation.getSeatId());
        return reservation;

    }
    public Reservation markAsConfirmed(Long reservationId){
        Reservation reservation = reservationRepository.findByReservationId(reservationId).orElseThrow(() -> new NotFoundException(
                "RESERVATION_NOT_FOUND", "Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");

        if(reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
            markAsExpired(reservationId);
            throw new BusinessConflictException("RESERVATION_EXPIRED","Reservation is expired");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        seatService.markAsBooked(reservation.getSeatId());

        return reservation;
    }
    public Reservation markAsExpired(Long reservationId) {
        Reservation reservation = reservationRepository.findByReservationId(reservationId).orElseThrow(()-> new NotFoundException(
                "RESERVATION_NOT_FOUND","Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");
        if (!reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
            throw new BusinessConflictException("RESERVATION_NOT_EXPIRED", "Reservation is not expired");
        }
        reservation.setStatus(ReservationStatus.EXPIRED);
        seatService.releaseSeat(reservation.getSeatId());
        return reservation;
    }
    private ReservationResponse toReservationResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getSeatId(),
                reservation.getCustomerId(),
                reservation.getStatus(),
                reservation.getExpiryDate()
        );
    }
    private CreateReservationRequest toCreateReservationRequest(Reservation reservation) {
        return new CreateReservationRequest(
                reservation.getSeatId(),
                reservation.getCustomerId()
        );
    }
}
