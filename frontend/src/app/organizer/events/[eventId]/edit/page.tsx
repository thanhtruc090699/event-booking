import { EventFormPage } from "@/features/organizer/components/EventFormPage";

type EditEventRouteProps = {
    params: Promise<{
        eventId: string;
    }>;
};

export default async function Page({ params }: EditEventRouteProps) {
    const { eventId } = await params;

    return <EventFormPage mode="edit" eventId={eventId} />;
}