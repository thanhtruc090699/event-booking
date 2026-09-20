package com.truc.eventbooking.payment;

import com.truc.eventbooking.payment.dto.CreatePaymentRequest;
import com.truc.eventbooking.payment.dto.PaymentOrderResponse;
import com.truc.eventbooking.security.CustomerUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private  final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/orders")
    public PaymentOrderResponse createPaymentOrder(@RequestBody CreatePaymentRequest request,
                                                   Authentication authentication){
        CustomerUserPrincipal principal = (CustomerUserPrincipal) authentication.getPrincipal();
        Long customerId = principal.getCustomerId();
        return paymentService.createPaymentOrder(request,customerId);
    }
}
