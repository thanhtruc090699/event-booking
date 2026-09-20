package com.truc.eventbooking.payment;

import com.truc.eventbooking.payment.dto.CreatePaymentRequest;
import com.truc.eventbooking.payment.dto.PaymentOrderResponse;
import com.truc.eventbooking.security.CustomerUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private  final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/orders")
    public PaymentOrderResponse createPaymentOrder(@RequestBody CreatePaymentRequest request,
                                                   @AuthenticationPrincipal CustomerUserPrincipal principal){
        return paymentService.createPaymentOrder(request, principal.getCustomerId());
    }

    @PostMapping("/{paymentId}/capture")
    public ResponseEntity<Void> capturePayment(
            @PathVariable Long paymentId,
            @AuthenticationPrincipal CustomerUserPrincipal principal) {
        paymentService.capturePayment(paymentId, principal.getCustomerId());
        return ResponseEntity.ok().build();
    }
}
