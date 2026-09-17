package com.truc.eventbooking.reservation;

import com.truc.eventbooking.reservation.dto.ReservationResponse;
import com.truc.eventbooking.reservation.dto.ReservationSummaryResponse;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
import com.truc.eventbooking.security.CustomerUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    ReservationService reservationService;
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationSummaryResponse createReservation(@Valid @RequestBody CreateReservationRequest request,
                                                 @AuthenticationPrincipal CustomerUserPrincipal principal){
        return reservationService.createReservation(request, principal.getCustomerId());
    }

    @GetMapping("/{reservationId}")
    public ReservationSummaryResponse getReservation(@PathVariable Long reservationId,
                                                      @AuthenticationPrincipal CustomerUserPrincipal principal){
        return reservationService.getReservationSummaryById(reservationId, principal.getCustomerId());
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations(){
        return reservationService.getAllReservations();
    }
}
