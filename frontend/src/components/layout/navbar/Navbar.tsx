"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { NavItem } from "./NavItem";
import { UserMenu } from "./UserMenu";
import { navContainerClass } from "./navbar.styles";
import {
    getMockUser,
    guestUser,
    signOutMockUser,
    type MockUser,
} from "@/features/auth/lib/mockAuth";

export function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<MockUser>(guestUser);

    useEffect(() => {
        setUser(getMockUser());

        function handleAuthChange() {
            setUser(getMockUser());
        }

        window.addEventListener("stagepass-auth-changed", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("stagepass-auth-changed", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    const isLoggedIn = user.authenticated;
    const isOrganizer = user.roles.includes("ORGANIZER");

    function handleSignOut() {
        signOutMockUser();
        setUser(guestUser);
        router.push("/login");
    }

    return (
        <nav className={navContainerClass}>
            <Logo />

            <div className="flex items-center justify-center gap-[6px]">
                <NavItem href="/">Home</NavItem>

                {isLoggedIn && (
                    <NavItem href="/tickets">
                        My Tickets
                    </NavItem>
                )}

                {isOrganizer && (
                    <NavItem href="/organizer/events">
                        My Events
                    </NavItem>
                )}
            </div>

            <UserMenu
                user={user}
                isLoggedIn={isLoggedIn}
                isOrganizer={isOrganizer}
                onSignOut={handleSignOut}
            />
        </nav>
    );
}