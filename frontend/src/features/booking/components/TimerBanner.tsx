import { cn } from "@/lib/cn";

type TimerBannerProps = {
    label: string;
    time: string;
    note?: string;
    danger?: boolean;
};

export function TimerBanner({
                                label,
                                time,
                                note,
                                danger = false,
                            }: TimerBannerProps) {
    return (
        <div
            className={cn(
                "mb-[18px] rounded-xl border p-4",
                danger
                    ? "border-[var(--crimson)] bg-[rgba(255,61,87,0.08)]"
                    : "border-[var(--gold)] bg-[rgba(245,184,65,0.08)]"
            )}
        >
            <div className="text-xs text-[var(--muted)]">
                {label}
            </div>

            <div
                className={cn(
                    "my-1 font-[var(--font-mono)] text-[28px] font-bold",
                    danger ? "text-[var(--crimson)]" : "text-[var(--gold)]"
                )}
            >
                {time}
            </div>

            {note && (
                <div className="text-xs text-[var(--muted)]">
                    {note}
                </div>
            )}
        </div>
    );
}