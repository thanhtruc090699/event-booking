import { TicketDetailPage } from "@/features/tickets/components/TicketDetailPage";

type TicketDetailRouteProps = {
    params: Promise<{
        ticketCode: string;
    }>;
};

export default async function Page({ params }: TicketDetailRouteProps) {
    const { ticketCode } = await params;

    return <TicketDetailPage ticketCode={ticketCode} />;
}