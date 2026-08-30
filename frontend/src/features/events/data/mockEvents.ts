export type EventCategory = "Concert" | "Festival" | "Theatre" | "Sports";

export type EventItem = {
    id: number;
    title: string;
    venue: string;
    city: string;
    date: string;
    imageUrl: string;
    category: EventCategory;
    hot?: boolean;
};

export const mockEvents: EventItem[] = [
    {
        id: 1,
        title: "Rock Concert Berlin",
        venue: "Berlin Arena",
        city: "Berlin",
        date: "20 Sep 2026",
        imageUrl: "https://picsum.photos/seed/event-1/480/270",
        category: "Concert",
        hot: true,
    },
    {
        id: 2,
        title: "Jazz Night Munich",
        venue: "Munich Philharmonic",
        city: "Munich",
        date: "25 Sep 2026",
        imageUrl: "https://picsum.photos/seed/event-2/480/270",
        category: "Concert",
    },
    {
        id: 3,
        title: "Electronic Nights Hamburg",
        venue: "Hamburg Warehouse",
        city: "Hamburg",
        date: "02 Oct 2026",
        imageUrl: "https://picsum.photos/seed/event-3/480/270",
        category: "Festival",
        hot: true,
    },
    {
        id: 4,
        title: "Classical Symphony Vienna",
        venue: "Vienna State Opera",
        city: "Vienna",
        date: "10 Oct 2026",
        imageUrl: "https://picsum.photos/seed/event-4/480/270",
        category: "Theatre",
    },
    {
        id: 5,
        title: "Indie & Rock Fest Frankfurt",
        venue: "Riverside Park",
        city: "Frankfurt",
        date: "18 Oct 2026",
        imageUrl: "https://picsum.photos/seed/g7/480/270",
        category: "Festival",
    },
    {
        id: 6,
        title: "Stand-up Comedy Cologne",
        venue: "Cologne Comedy Club",
        city: "Cologne",
        date: "28 Sep 2026",
        imageUrl: "https://picsum.photos/seed/event-6/480/270",
        category: "Theatre",
        hot: true,
    },
    {
        id: 7,
        title: "Classic Rock Revival Tour",
        venue: "Hamburg Warehouse",
        city: "Hamburg",
        date: "14 Nov 2026",
        imageUrl: "https://picsum.photos/seed/g6/480/270",
        category: "Concert",
    },
    {
        id: 8,
        title: "Opera Night Dresden",
        venue: "Semperoper",
        city: "Dresden",
        date: "12 Nov 2026",
        imageUrl: "https://picsum.photos/seed/g8/480/270",
        category: "Theatre",
    },
];