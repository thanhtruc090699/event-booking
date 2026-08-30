export const mockBooking = {
    event: {
        title: "Rock Concert Berlin",
        imageUrl: "https://picsum.photos/seed/event-1/700/300",
        summaryImageUrl: "https://picsum.photos/seed/event-1/120/120",
        venue: "Mercedes-Benz Arena, Berlin",
        date: "20 September 2026",
        time: "19:00",
    },
    selectedSeats: [
        {
            section: "A",
            row: "1",
            seat: "5",
            price: 49.9,
        },
        {
            section: "A",
            row: "1",
            seat: "7",
            price: 49.9,
        },
    ],
    serviceFee: 4.0,
    bookingReference: "BK-2026-9001",
    ticketCode: "TCK-9001",
};

export function formatEuro(amount: number) {
    return `€${amount.toFixed(2)}`;
}

export function getTicketsTotal() {
    return mockBooking.selectedSeats.reduce(
        (total, seat) => total + seat.price,
        0
    );
}

export function getOrderTotal() {
    return getTicketsTotal() + mockBooking.serviceFee;
}