"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (config: {
                        client_id: string;
                        lang: string;
                        callback: (response: { credential?: string }) => void;
                    }) => void;
                    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
                };
            };
        };
    }
}

type SocialLoginButtonsProps = {
    onSuccess?: () => void;
};

export function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
    const { loginWithSocial } = useAuth();
    const [error, setError] = useState("");
    const [gsiReady, setGsiReady] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const handleToken = useCallback(
        async (provider: "google", token: string) => {
            try {
                await loginWithSocial(provider, token);
                setError("");
                onSuccess?.();
            } catch (e) {
                console.error(e);
                setError("Social sign-in failed. Please try again.");
            }
        },
        [loginWithSocial, onSuccess]
    );

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            const next = Math.floor(entry.contentRect.width);
            setContainerWidth((prev) => (prev === next ? prev : next));
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const googleId = window.google?.accounts?.id;
        if (!gsiReady || !googleClientId || !googleId || !googleButtonRef.current) return;
        if (containerWidth <= 0) return;

        googleId.initialize({
            client_id: googleClientId,
            lang: "en",
            callback: (response) => {
                if (response.credential) {
                    handleToken("google", response.credential);
                }
            },
        });

        googleButtonRef.current.replaceChildren();
        googleId.renderButton(googleButtonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: containerWidth,
        });
    }, [gsiReady, googleClientId, containerWidth, handleToken]);

    return (
        <div className="mt-7 space-y-3">
            {googleClientId ? (
                <div ref={containerRef} className="w-full">
                    <div ref={googleButtonRef} className="w-full" />
                </div>
            ) : (
                <p className="text-xs text-red-500">Google client ID is not configured.</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onReady={() => setGsiReady(true)}
            />
        </div>
    );
}