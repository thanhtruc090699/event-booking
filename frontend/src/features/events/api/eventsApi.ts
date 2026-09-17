import {apiClient} from "@/lib/api/apiClient";

export type EventDto = {
    id: number;
    title: string;
    description: string;
    venue: string;
    city: string;
    category: string;
    imageUrl: string;
    startingPrice: number;
    startDate: string;
    availableSeats: number;
    hot: boolean;
};

export type SeatDto = {
    seatId: number;
    section: string;
    rowLabel: string;
    seatNumber: string;
    price: number;
    status: "AVAILABLE" | "RESERVED" | "BOOKED";
};

export function getEvents(){
    return apiClient<EventDto[]>("/api/events");
}

export function getEventById(eventId: string){
    return apiClient<EventDto>(`/api/events/${eventId}`);
}

export function getEventSeats(eventId: string){
    return apiClient<SeatDto[]>(`/api/events/${eventId}/seats`);
}

