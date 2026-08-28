import Link from "next/link";

interface LogoProps {
    className?: string;
}

export function Logo({ className = "" }: LogoProps) {
    return (
        <Link href="/" className={className}>
            STAGE<span style={{ color: "#FF3D57" }}>PASS</span>
        </Link>
    );
}
