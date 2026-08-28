import { Button } from "@/components/ui/Button";
import { avatarClass, roleBadgeClass, loginLinkClass, authActionsClass } from "./navbar.styles";
import Link from "next/link";

type Props = {
    isLoggedIn: boolean;
    isOrganizer: boolean;
};

export function UserMenu({
    isLoggedIn,
    isOrganizer,
}: Props) {
    if (!isLoggedIn) {
        return (
            <div className={authActionsClass}>
                <Link href="/login" className={loginLinkClass}>
                    Log in
                </Link>
                <Button className="px-5 py-2.5">
                    Sign in
                </Button>
            </div>
        );
    }

    return (
        <div className={authActionsClass}>
            <span className={roleBadgeClass}>
                {isOrganizer
                    ? "CUSTOMER + ORGANIZER"
                    : "CUSTOMER"}
            </span>

            <div className={avatarClass}>
                TN
            </div>

            <Button variant="ghost" className="px-3 py-1.5 text-xs">
                Sign Out
            </Button>
        </div>
    );
}
