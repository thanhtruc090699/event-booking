package com.truc.eventbooking.booking;

import com.truc.eventbooking.auth.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT b FROM Booking b JOIN b.reservation r WHERE r.customer = :customer ORDER BY b.createdAt DESC")
    List<Booking> findByCustomer(@Param("customer") Customer customer);
    
    @Query("SELECT b FROM Booking b WHERE b.ticketCode = :ticketCode")
    Booking findByTicketCode(@Param("ticketCode") String ticketCode);
}
