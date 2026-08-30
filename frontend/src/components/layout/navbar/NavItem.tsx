"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { navLinkClass } from "./navbar.styles";

type NavItemProps = {
    href: string;
    children: React.ReactNode;
};

export function NavItem({ href, children }: NavItemProps) {
    const pathname = usePathname();

    const isActive =
        href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={cn(
                navLinkClass,
                isActive &&
                "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]"
            )}
        >
            {children}
        </Link>
    );
}