package com.truc.eventbooking.payment;
import org.springframework.stereotype.Service;

@Service
public class MockPaymentService {
    public PaymentStatus pay(Long customerId, Long reservationId) {
        return PaymentStatus.SUCCEEDED;
    }
}
