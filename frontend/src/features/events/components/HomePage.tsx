import {HeroSection} from "@/features/events/components/HeroSection";
import {SearchSection} from "@/features/events/components/SearchSection";
import {UpcomingEventsSection} from "@/features/events/components/UpcomingEvents";
export default function HomePage() {
    return (
        <>
            <HeroSection />
            <SearchSection />
            <UpcomingEventsSection />
        </>
    );
}