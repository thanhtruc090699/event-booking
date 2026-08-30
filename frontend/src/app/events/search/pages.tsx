import { SearchResultsPage } from "@/features/events/components/SearchResultsPage";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function Page({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    return <SearchResultsPage initialQuery={params.q ?? ""} />;
}