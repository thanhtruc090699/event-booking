import { EventDetailPage } from "@/features/events/components/EventDetailPage";

type EventDetailRouteProps = {
    params: Promise<{
        eventId: string;
    }>;
};

export default async function Page({ params }: EventDetailRouteProps) {
    const { eventId } = await params;

    return <EventDetailPage eventId={eventId} />;
}