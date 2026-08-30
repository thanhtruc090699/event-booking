import { cn } from "@/lib/cn";

type PaymentOptionProps = {
    label: string;
    selected?: boolean;
};

export function PaymentOption({
                                  label,
                                  selected = false,
                              }: PaymentOptionProps) {
    return (
        <div
            className={cn(
                "mb-2.5 flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 text-sm",
                selected
                    ? "border-[var(--gold)] bg-[rgba(245,184,65,0.06)]"
                    : "border-[var(--border)] bg-transparent text-[var(--ink)]"
            )}
        >
            <span
                className={cn(
                    "relative h-4 w-4 rounded-full border-2",
                    selected ? "border-[var(--gold)]" : "border-[var(--border)]"
                )}
            >
                {selected && (
                    <span className="absolute inset-[2px] rounded-full bg-[var(--gold)]" />
                )}
            </span>

            {label}
        </div>
    );
}