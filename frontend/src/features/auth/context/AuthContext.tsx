"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
    login as loginApi,
    socialLogin as socialLoginApi,
    getCurrentUser,
    refreshAccessToken,
    logout as logoutApi,
    type MeResponse,
} from "../api/authApi";

interface AuthContextType {
    user: MeResponse | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithSocial: (provider: "google", token: string) => Promise<void>;
    logout: () => void;
    updateToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MeResponse | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function login(email: string, password: string) {
        const response = await loginApi({ email, password });
        setAccessToken(response.accessToken);

        // Get user info after having access token
        const me = await getCurrentUser(response.accessToken);
        setUser(me);
    }

    async function loginWithSocial(provider: "google", token: string) {
        const response = await socialLoginApi({ provider, token });
        setAccessToken(response.accessToken);

        const me = await getCurrentUser(response.accessToken);
        setUser(me);
    }

    async function logout() {
        try { await logoutApi(); } catch {}
        setAccessToken(null);
        setUser(null);
    }

    function updateToken(token: string) {
        setAccessToken(token);
    }

    useEffect(() => {
        async function restoreSession() {
            try {
                // Call refresh — browser automatically sends HttpOnly cookie
                const refreshResponse = await refreshAccessToken();
                setAccessToken(refreshResponse.accessToken);

                const me = await getCurrentUser(refreshResponse.accessToken);
                setUser(me);
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: user !== null,
                isLoading,
                login,
                loginWithSocial,
                logout,
                updateToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}