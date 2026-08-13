package com.truc.eventbooking.reservation;

import org.springframework.stereotype.Controller;
import com.truc.eventbooking.reservation.dto.ReservationResponse;
import com.truc.eventbooking.reservation.dto.CreateReservationRequest;
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
    public ReservationResponse createReservation(@RequestBody CreateReservationRequest request){
        return reservationService.createReservation(request);
    }

    @GetMapping("/{reservationId}")
    public ReservationResponse getReservationbyReservationId(@PathVariable Long reservationId){
        return reservationService.getReservationById(reservationId);
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations(){
        return reservationService.getAllReservations();
    }



}
