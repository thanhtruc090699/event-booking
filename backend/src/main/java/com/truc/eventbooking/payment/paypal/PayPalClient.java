package com.truc.eventbooking.payment.paypal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class PayPalClient {

    private final RestClient restClient;
    private final String clientId;
    private final String clientSecret;
    private final String baseUrl;

    public PayPalClient(
            @Value("${paypal.client-id}") String clientId,
            @Value("${paypal.client-secret}") String clientSecret,
            @Value("${paypal.base-url}") String baseUrl
    ) {
        this.restClient = RestClient.create();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
    }

    private String getAccessToken() {

        Map<?, ?> response = restClient.post()
                .uri(baseUrl + "/v1/oauth2/token")
                .headers(headers ->
                        headers.setBasicAuth(clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(Map.class);

        if (response == null ||
                response.get("access_token") == null) {
            throw new IllegalStateException(
                    "Failed to get PayPal access token"
            );
        }

        return response.get("access_token").toString();
    }

    public String createOrder(
            BigDecimal amount,
            String currency
    ){
        String accessToken = getAccessToken();

        String formattedAmount = amount
                .setScale(2, RoundingMode.HALF_UP)
                .toPlainString();

        Map<String, Object> amountData = Map.of(
                "currency_code", currency,
                "value", formattedAmount
        );

        Map<String, Object> purchaseUnit = Map.of(
                "amount", amountData
        );

        Map<String, Object> requestBody = Map.of(
                "intent", "CAPTURE",
                "purchase_units", List.of(purchaseUnit)
        );

        Map<?, ?> response = restClient.post()
                .uri(baseUrl + "/v2/checkout/orders")
                .headers(headers ->
                        headers.setBearerAuth(accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null ||
                response.get("id") == null) {

            throw new IllegalStateException(
                    "Failed to create PayPal order"
            );
        }

        return response.get("id").toString();
    }

    public String captureOrder(String providerOrderId) {
        String accessToken = getAccessToken();

        Map<?, ?> response = restClient.post()
                .uri(baseUrl + "/v2/checkout/orders/" + providerOrderId + "/capture")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of())
                .retrieve()
                .body(Map.class);

        if (response == null || !"COMPLETED".equals(response.get("status"))) {
            throw new IllegalStateException("PayPal capture was not completed");
        }

        Object purchaseUnitsValue = response.get("purchase_units");
        if (!(purchaseUnitsValue instanceof List<?> purchaseUnits) || purchaseUnits.isEmpty()) {
            throw new IllegalStateException("PayPal capture response has no purchase units");
        }

        Map<?, ?> purchaseUnit = (Map<?, ?>) purchaseUnits.get(0);
        Map<?, ?> payments = (Map<?, ?>) purchaseUnit.get("payments");
        List<?> captures = (List<?>) payments.get("captures");

        if (captures == null || captures.isEmpty()) {
            throw new IllegalStateException("PayPal capture response has no capture ID");
        }

        Map<?, ?> capture = (Map<?, ?>) captures.get(0);
        return Objects.requireNonNull(capture.get("id")).toString();
    }
}
