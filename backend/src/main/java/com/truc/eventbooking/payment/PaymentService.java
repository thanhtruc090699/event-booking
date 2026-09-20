package com.truc.eventbooking.payment;

import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.payment.dto.CreatePaymentRequest;
import com.truc.eventbooking.payment.dto.PaymentOrderResponse;
import com.truc.eventbooking.payment.provider.PaymentProvider;
import com.truc.eventbooking.reservation.Reservation;
import com.truc.eventbooking.reservation.ReservationRepository;
import com.truc.eventbooking.reservation.ReservationStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    private final Map<PaymentProviderType, PaymentProvider> paymentProviders;

    private final String currency;

    public PaymentService(
            PaymentRepository paymentRepository,
            ReservationRepository reservationRepository,
            List<PaymentProvider> providers,
            @Value("${payment.currency}") String currency
    ) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;

        this.paymentProviders = providers.stream()
                .collect(Collectors.toMap(
                        PaymentProvider::getType,
                        Function.identity()
                ));

        this.currency = currency;
    }

    public PaymentOrderResponse createPaymentOrder(
            CreatePaymentRequest request,
            Long customerId
    ) {

        Long reservationId = request.reservationId();

        Reservation reservation =
                reservationRepository.findById(reservationId)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "RESERVATION_NOT_FOUND",
                                        "Reservation not found"
                                )
                        );

        // Ownership
        if (!reservation.getCustomer()
                .getCustomerId()
                .equals(customerId)) {

            throw new BusinessConflictException(
                    "NOT_OWNER",
                    "You don't own this reservation"
            );
        }

        // Status
        if (reservation.getStatus()
                != ReservationStatus.ACTIVE) {

            throw new BusinessConflictException(
                    "RESERVATION_NOT_ACTIVE",
                    "Reservation not active"
            );
        }

        // Expiry
        if (reservation.getExpiryDate()
                .isBefore(OffsetDateTime.now())) {

            throw new BusinessConflictException(
                    "RESERVATION_EXPIRED",
                    "Reservation expired"
            );
        }

        // Amount from DB
        BigDecimal amount = reservation
                .getReservationSeats()
                .stream()
                .map(rs -> rs.getSeat().getSeatPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // choose provider implementation
        PaymentProvider provider =
                paymentProviders.get(
                        request.paymentProviderType()
                );

        if (provider == null) {
            throw new BusinessConflictException(
                    "PAYMENT_PROVIDER_NOT_SUPPORTED",
                    "Payment provider is not supported"
            );
        }

        // create local payment
        Payment payment = new Payment(
                reservation,
                request.paymentProviderType(),
                amount,
                currency
        );

        paymentRepository.save(payment);

        String providerOrderId =
                provider.createOrder(
                        amount,
                        currency
                );

        // save external order ID
        payment.setProviderOrderId(
                providerOrderId
        );

        paymentRepository.save(payment);

        return new PaymentOrderResponse(
                payment.getId(),
                providerOrderId
        );
    }
}