package com.truc.eventbooking.security;

import com.truc.eventbooking.auth.Customer;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JWTService {
    private final SecretKey secretKey;
    private  final long expirationMs;
    private final long refreshExpirationMs;

    public JWTService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.access-expiration-ms}") long expirationMs,
                      @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateRefreshToken(Customer customer){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationMs);
        return Jwts.builder()
                .subject(customer.getEmail())
                .claim("customerId", customer.getCustomerId())
                .claim("fullName", customer.getFullName())
                .claim("type", "REFRESH")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public String generateToken(Customer customer) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(customer.getEmail())
                .claim("customerId", customer.getCustomerId())
                .claim("fullName", customer.getFullName())
                .claim("type", "ACCESS")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();

    }

    public long getExpirationMs(){
        return expirationMs;
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseClaimsJws(token).getPayload();
    }

    public String extractEmail(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String extractfullName(String token) {
        return getClaimsFromToken(token).get("fullName").toString();
    }

    public Long extractCustomerId(String token) {
        Number customerId = getClaimsFromToken(token).get("customerId", Number.class);
        return customerId.longValue();
    }

    public Date extractExpiration(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    public boolean isExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    public String extractTokenType(String token) {
        return getClaimsFromToken(token).get("type").toString();
    }

    public boolean isValidToken(String token, Customer customer) {
        String email = extractEmail(token);
        Long customerId = extractCustomerId(token);

        return email.equals(customer.getEmail()) && customerId.equals(customer.getCustomerId())
                && !isExpired(token);
    }

    public boolean isValidAccessToken(String accessToken, Customer customer){
        return isValidToken(accessToken, customer) && extractTokenType(accessToken).equals("ACCESS");
    }

    public boolean isValidRefreshToken(String refreshToken, Customer customer){
        return isValidToken(refreshToken, customer) && extractTokenType(refreshToken).equals("REFRESH");
    }

}
