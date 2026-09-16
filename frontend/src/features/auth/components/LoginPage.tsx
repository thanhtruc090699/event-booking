"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        try {
            await login(email, password);
            router.push("/");
        } catch (error) {
            console.error(error);
            setError("Invalid email or password");
        }
    }

    function handleSocialSuccess() {
        router.push("/");
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
            <AuthBackground />

            <section className="relative z-10 w-full max-w-[400px] rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-8 py-9">
                <div className="mb-2 text-center text-2xl tracking-tight text-[var(--ink)]">
                    STAGE<span className="text-[var(--crimson)]">PASS</span>
                </div>

                <h1 className="text-center font-[var(--font-bebas)] text-4xl tracking-wide text-[var(--ink)]">
                    Welcome back
                </h1>

                <p className="mt-1 text-center text-sm text-[var(--muted)]">
                    Sign in to continue booking tickets.
                </p>

                <SocialLoginButtons onSuccess={handleSocialSuccess} />

                <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
                    <div className="h-px flex-1 bg-[var(--border)]" />
                    or
                    <div className="h-px flex-1 bg-[var(--border)]" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                        />
                    </div>

                    {error && (
                        <p className="mb-4 text-sm text-red-500">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-[var(--crimson)] px-4 py-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--crimson-dim)]"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--muted)]">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-[var(--gold)]"
                    >
                        Sign up
                    </Link>
                </p>
            </section>
        </main>
    );
}

function AuthBackground() {
    const images = [
        "https://picsum.photos/seed/event-2/500/500",
        "https://picsum.photos/seed/event-4/500/500",
        "https://picsum.photos/seed/event-1/500/500",
        "https://picsum.photos/seed/event-3/500/500",
        "https://picsum.photos/seed/event-6/500/500",
    ];

    return (
        <div className="absolute inset-0">
            <div className="grid h-full grid-cols-3 grid-rows-2 opacity-35">
                {images.map((image) => (
                    <div
                        key={image}
                        className="bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,12,0.55)_0%,var(--void)_75%)]" />
        </div>
    );
}