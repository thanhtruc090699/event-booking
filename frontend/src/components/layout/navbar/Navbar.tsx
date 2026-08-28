import { Logo } from "@/components/ui/Logo";
import { NavItem } from "./NavItem";
import { UserMenu } from "./UserMenu";
import { navContainerClass } from "./navbar.styles";
import Link from "next/link";

const mockUser = {
    authenticated: true,
    roles: ["CUSTOMER", "ORGANIZER"],
};

export function Navbar() {
    const isOrganizer = mockUser.roles.includes("ORGANIZER");

    return (
        <nav className={navContainerClass}>
            <Logo />

            <div className="flex justify-center gap-[6px] items-center">
                <NavItem href="/" active>
                    Events
                </NavItem>

                {mockUser.authenticated && (
                    <NavItem href="/tickets">
                        My Tickets
                    </NavItem>
                )}

                {isOrganizer && (
                    <NavItem href="/organizer/events">
                        Organizer
                    </NavItem>
                )}

                {isOrganizer && (
                    <NavItem href="/organizer/events">
                        Create/ Edit Event
                    </NavItem>
                )}
            </div>

            <UserMenu
                isLoggedIn={mockUser.authenticated}
                isOrganizer={isOrganizer}
            />
        </nav>
    );
}
