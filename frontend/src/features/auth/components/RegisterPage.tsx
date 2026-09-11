"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInMockUser } from "@/features/auth/lib/mockAuth";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { register } from "@/features/auth/api/authApi";

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
        if(password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            await register({
                name,
                email,
                password,
            });
            router.push("/login");

        } catch (error) {
            console.error(error);
            setError("Registration failed. Please try again.");
        }
    }

    function handleSocialRegister() {
        signInMockUser();
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
                    Create account
                </h1>

                <p className="mt-1 text-center text-sm text-[var(--muted)]">
                    Book events in seconds.
                </p>

                <div className="mt-7 space-y-3">
                    <button
                        type="button"
                        onClick={handleSocialRegister}
                        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[var(--border)] bg-[#f2f2f5] px-4 py-3 text-sm font-semibold text-[#1f1f24]"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        type="button"
                        onClick={handleSocialRegister}
                        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#1877F2] bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Continue with Facebook
                    </button>
                </div>

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