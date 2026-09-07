import {apiClient} from "@/lib/api/apiClient";

export type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "GOOGLE_PAY" | "APPLE_PAY";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type ReservationStatus = "ACTIVE" | "EXPIRED" | "CONFIRMED" | "CANCELLED";

export type ReservedSeatDto = {
    id: number;
    section: string;
    rowLabel: string;
    seatNumber: string;
    price: number;
};

export type CreateReservationRequest = {
    eventId: number;
    seatIds: number[];
};

export type ReservationSummaryDto = {
    id: number;
    eventId: number;
    status: ReservationStatus;
    expiresAt: string;
    event: {
        id: number;
        title: string;
        imageUrl: string;
        venue: string;
        city: string;
        startDate: string;
    };

    selectedSeats: ReservedSeatDto[]
};

export type createBookingRequest = {
    reservationId: number;
    paymentMethod: PaymentMethod;
};

export type BookingSummaryDto = {
    id: number;
    bookingReference: string;
    status: BookingStatus;
    createdAt: string;
    totalAmount: number;
};

export type BookingDetailsDto = {
    id: number;
    bookingReference: string;
    status: BookingStatus;
    totalAmount: number;
    createdAt: string;
    paymentMethod: PaymentMethod;
    Reservation: ReservationSummaryDto;
};

export function createReservation(payload: CreateReservationRequest, token: string) {
    return apiClient<ReservationSummaryDto>("/api/reservations", {
        method: "POST",
        token,
        body: JSON.stringify(payload)
    });
}

export function getReservation(reservationId: string, token: string) {
    return apiClient<ReservationSummaryDto>(`/api/reservations/${reservationId}`, {
        token
    });
}

export function createBooking(payload: createBookingRequest, token: string) {
    return apiClient<BookingSummaryDto>("/api/bookings", {
        method: "POST",
        token,
        body: JSON.stringify(payload)
    });
}

export function getBooking(bookingId: string, token: string) {
    return apiClient<BookingDetailsDto>(`/api/bookings/${bookingId}`, {
        token
    });
}