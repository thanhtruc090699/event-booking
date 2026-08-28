import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    children: ReactNode;
};

export function Button({
                           variant = "primary",
                           className,
                           children,
                           ...props
                       }: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
                "disabled:cursor-not-allowed disabled:opacity-50",
                variant === "primary" &&
                "border border-[var(--crimson)] bg-[var(--crimson)] text-[var(--ink)] hover:bg-[var(--crimson-dim)]",
                variant === "secondary" &&
                "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-hover)]",
                variant === "ghost" &&
                "border border-[var(--border)] bg-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}