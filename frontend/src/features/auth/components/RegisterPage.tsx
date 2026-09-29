"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { register } from "@/features/auth/api/authApi";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { isLoading } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if(password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter");
            return;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError("Password must contain at least one special character");
            return;
        }

        try {
            await register({
                fullName: name,
                email,
                password,
            });
            router.push("/login");

        } catch (error) {
            console.error(error);
            setError("Registration failed. Please try again.");
        }
    }

    function handleSocialSuccess() {
        router.push("/");
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
            <AuthBackground />

            <section className="relative z-10 w-full max-w-[400px] rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-6 py-9 sm:px-8">
                <div className="mb-2 text-center text-2xl tracking-tight text-[var(--ink)]">
                    STAGE<span className="text-[var(--crimson)]">PASS</span>
                </div>

                <h1 className="text-center font-[var(--font-bebas)] text-4xl tracking-wide text-[var(--ink)]">
                    Create account
                </h1>

                <p className="mt-1 text-center text-sm text-[var(--muted)]">
                    Book events in seconds.
                </p>

                <SocialLoginButtons onSuccess={handleSocialSuccess} />

                <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted)]">
                    <div className="h-px flex-1 bg-[var(--border)]" />
                    or
                    <div className="h-px flex-1 bg-[var(--border)]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Truc Nguyen"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-[var(--muted)]">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--void)] px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--muted)]">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-[var(--gold)]"
                    >
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    );
}

function AuthBackground() {
    const images = [
        "https://picsum.photos/seed/event-1/500/500",
        "https://picsum.photos/seed/event-3/500/500",
        "https://picsum.photos/seed/event-5/500/500",
        "https://picsum.photos/seed/event-6/500/500",
        "https://picsum.photos/seed/event-4/500/500",
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