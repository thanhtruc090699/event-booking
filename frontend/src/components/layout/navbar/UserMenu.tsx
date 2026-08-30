import Link from "next/link";
import type { MockUser } from "@/features/auth/lib/mockAuth";
import { avatarClass, roleBadgeClass } from "./navbar.styles";

type UserMenuProps = {
    user: MockUser;
    isLoggedIn: boolean;
    isOrganizer: boolean;
    onSignOut: () => void;
};

export function UserMenu({
                             user,
                             isLoggedIn,
                             isOrganizer,
                             onSignOut,
                         }: UserMenuProps) {
    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
                >
                    Sign in
                </Link>

                <Link
                    href="/register"
                    className="rounded-lg border border-[var(--crimson)] bg-[var(--crimson)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                >
                    Sign up
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className={roleBadgeClass}>
                {isOrganizer ? "CUSTOMER + ORGANIZER" : "CUSTOMER"}
            </span>

            <div className={avatarClass}>
                {user.initials}
            </div>

            <button
                type="button"
                onClick={onSignOut}
                className="rounded-lg border border-[var(--border)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
            >
                Sign out
            </button>
        </div>
    );
}