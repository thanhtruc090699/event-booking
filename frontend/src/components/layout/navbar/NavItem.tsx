import Link from "next/link";
import { navLinkClass, activeNavLinkClass } from "./navbar.styles";

type Props = {
    href: string;
    children: React.ReactNode;
    active?: boolean;
};

export function NavItem({ href, children, active = false }: Props) {
    return (
        <Link href={href} className={active ? activeNavLinkClass : navLinkClass}>
            {children}
        </Link>
    );
}