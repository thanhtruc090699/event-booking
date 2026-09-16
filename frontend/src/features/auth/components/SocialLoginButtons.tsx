"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (config: {
                        client_id: string;
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

    const initGoogle = useCallback(() => {
        if (!window.google?.accounts?.id || !googleButtonRef.current || !googleClientId) return;
        window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
                if (response.credential) {
                    handleToken("google", response.credential);
                }
            },
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: 336,
        });
    }, [googleClientId, handleToken]);

    return (
        <div className="mt-7 space-y-3">
            {googleClientId ? (
                <div ref={googleButtonRef} className="w-full" />
            ) : (
                <p className="text-xs text-red-500">Google client ID is not configured.</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onReady={initGoogle}
            />
        </div>
    );
}