import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
    children: ReactNode;
};

const baseClass =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold";

const variantClasses = {
    default:
        "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",

    success:
        "border-green-500 bg-green-500/10 text-green-400",

    warning:
        "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]",

    danger:
        "border-[var(--crimson)] bg-[var(--crimson)]/10 text-[var(--crimson)]",
};

export function Badge({
                          variant = "default",
                          className,
                          children,
                          ...props
                      }: BadgeProps) {
    return (
        <span
            className={cn(
                baseClass,
                variantClasses[variant],
                className
            )}
            {...props}
        >
      {children}
    </span>
    );
}