package com.truc.eventbooking.reservation;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatService;
import com.truc.eventbooking.seat.SeatStatus;
import org.springframework.stereotype.Service;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
import com.truc.eventbooking.reservation.dto.ReservationResponse;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;
    public ReservationService(ReservationRepository reservationRepository, SeatRepository seatRepository) {
        this.reservationRepository = reservationRepository;
        this.seatRepository = seatRepository;
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
        Seat eventSeat = seatRepository.findBySeatId(seatId).orElseThrow(() -> new RuntimeException("Seat Not Found"));

        if(eventSeat.getSeatStatus()!= SeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat Status Not Available");
        } else eventSeat.setSeatStatus(SeatStatus.RESERVED);

        Reservation reservation = reservationRepository.save(createReservationRequest.eventSeatId(), createReservationRequest.customerId());
        return toReservationResponse(reservation);
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
