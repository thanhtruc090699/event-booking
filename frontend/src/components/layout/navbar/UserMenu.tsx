import { Button } from "@/components/ui/Button";
import { avatarClass, roleBadgeClass } from "./navbar.styles";
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
            <>
                <Link href="/login">
                    Đăng nhập
                </Link>

                <Button>
                    Đăng ký
                </Button>
            </>
        );
    }

    return (
        <>
      <span className={roleBadgeClass}>
        {isOrganizer
            ? "CUSTOMER + ORGANIZER"
            : "CUSTOMER"}
      </span>

            <div className={avatarClass}>
                TN
            </div>
        </>
    );
}