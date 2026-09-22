import Link from "next/link";
import type { MeResponse } from "@/features/auth/api/authApi";
import { avatarClass } from "./navbar.styles";

type UserMenuProps = {
    user: MeResponse | null;
    isLoggedIn: boolean;
    onSignOut: () => void;
};

export function UserMenu({ user, isLoggedIn, onSignOut }: UserMenuProps) {
    if (!isLoggedIn || !user) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]">
                    Sign in
                </Link>
                <Link href="/register" className="rounded-lg border border-[var(--crimson)] bg-[var(--crimson)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]">
                    Sign up
                </Link>
            </div>
        );
    }

    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center gap-3">
            <div className={avatarClass}>{initials}</div>
            <button
                type="button"
                onClick={onSignOut}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
                Sign out
            </button>
        </div>
    );
}