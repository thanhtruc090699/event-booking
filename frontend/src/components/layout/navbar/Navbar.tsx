import Link from "next/link";

import { NavItem } from "./NavItem";
import { UserMenu } from "./UserMenu";

const mockUser = {
    authenticated: true,
    roles: ["CUSTOMER", "ORGANIZER"],
};

export function Navbar() {

    const isOrganizer =
        mockUser.roles.includes("ORGANIZER");

    return (

        <nav>

            <Link href="/">
                StagePass
            </Link>

            <div>

                <NavItem href="/">
                    Explore Events
                </NavItem>

                {mockUser.authenticated && (

                    <NavItem href="/tickets">
                        My Tickets
                    </NavItem>

                )}

                {isOrganizer && (

                    <NavItem href="/organizer/events">
                        Organize an Event
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