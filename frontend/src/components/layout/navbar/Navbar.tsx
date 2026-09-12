"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { NavItem } from "./NavItem";
import { UserMenu } from "./UserMenu";
import { navContainerClass } from "./navbar.styles";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    const isLoggedIn = isAuthenticated;

    function handleSignOut() {
        logout();
        router.push("/login");
    }

    return (
        <nav className={navContainerClass}>
            <Logo />
            <div className="flex items-center justify-center gap-[6px]">
                {isLoggedIn && <NavItem href="/tickets">My Tickets</NavItem>}
            </div>
            <UserMenu
                user={user}
                isLoggedIn={isLoggedIn}
                onSignOut={handleSignOut}
            />
        </nav>
    );
}