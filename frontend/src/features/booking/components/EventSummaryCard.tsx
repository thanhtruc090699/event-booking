import Image from "next/image";

type EventSummaryCardProps = {
    imageUrl: string;
    title: string;
    meta: string;
};

export function EventSummaryCard({
                                      imageUrl,
                                      title,
                                      meta,
                                  }: EventSummaryCardProps) {
    return (
        <div className="mb-[18px] flex items-center gap-[14px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[14px]">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            <div>
                <h3 className="text-[15px] font-semibold text-[var(--ink)]">
                    {title}
                </h3>

                <p className="mt-1 text-xs text-[var(--muted)]">
                    {meta}
                </p>
            </div>
        </div>
    );
}