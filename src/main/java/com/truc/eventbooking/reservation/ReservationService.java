package com.truc.eventbooking.reservation;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.seat.Seat;
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
        return reservationRepository.findById(reservationId).map(this::toReservationResponse).orElseThrow(()-> new RuntimeException("Reservation not found"));

    }
    public ReservationResponse getReservationBySeatId(Long seatId) {
        return reservationRepository.findBySeat_SeatId(seatId).map(this::toReservationResponse).orElseThrow(()-> new RuntimeException("Reservation not found"));
    }
    public ReservationResponse createReservation(CreateReservationRequest createReservationRequest) {
        Long seatId = createReservationRequest.eventSeatId();

        Seat seat = seatService.markAsReserved(seatId);

        Reservation reservation = new Reservation(seat,createReservationRequest.customerId());

        Reservation savedReservation = reservationRepository.save(reservation);
        return toReservationResponse(savedReservation);
    }
    public Reservation markAsCancelled(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new NotFoundException(
                "RESERVATION_NOT_FOUND", "Reservation not found"
        ));
        if(reservation.getStatus()!=ReservationStatus.ACTIVE) throw new BusinessConflictException("RESERVATION_NOT_ACTIVE","Reservation not active");


        reservation.setStatus(ReservationStatus.CANCELLED);
        seatService.releaseSeat(reservation.getSeat().getSeatId());
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

        reservation.setStatus(ReservationStatus.CONFIRMED);
        seatService.markAsBooked(reservation.getSeat().getSeatId());

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
        reservation.setStatus(ReservationStatus.EXPIRED);
        seatService.releaseSeat(reservation.getSeat().getSeatId());
        return reservation;
    }
    private ReservationResponse toReservationResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getSeat().getSeatId(),
                reservation.getCustomerId(),
                reservation.getStatus(),
                reservation.getExpiryDate()
        );
    }
    private CreateReservationRequest toCreateReservationRequest(Reservation reservation) {
        return new CreateReservationRequest(
                reservation.getSeat().getSeatId(),
                reservation.getCustomerId()
        );
    }
}
