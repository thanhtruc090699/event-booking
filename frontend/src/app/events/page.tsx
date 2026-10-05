import { Suspense } from "react";
import { AllEventsPage } from "@/features/events/components/AllEventsPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AllEventsPage />
    </Suspense>
  );
}