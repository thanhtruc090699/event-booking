import { apiClient } from "@/lib/api/apiClient";

export type TicketStatus = "UPCOMING" | "USED" | "EXPIRED" | "CANCELLED";

export type seatsDto = {
    id: number;
    section: string;
    rowLabel: string;
    seatNumber: string;
};

export type TicketDto = {
    ticketCode: string;
    status: TicketStatus;
    seat: seatsDto;
    event: {
        id: number;
        title: string;
        imageUrl: string;
        venue: string;
        city: string;
        startDate: string;
    };
};

export function getUserTickets(token: string) {
    return apiClient<TicketDto[]>("/api/me/tickets",{token,});
}

export function getTicketCode(ticketCode: string, token: string) {
    return apiClient<TicketDto>(`/api/me/tickets/${ticketCode}`, {token,});
}