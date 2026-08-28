import Link from "next/link";
import { navLinkClass } from "./navbar.styles";

type Props = {
    href: string;
    children: React.ReactNode;
};

export function NavItem({ href, children }: Props) {
    return (
        <Link href={href} className={navLinkClass}>
            {children}
        </Link>
    );
}