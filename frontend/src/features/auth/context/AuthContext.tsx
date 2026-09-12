"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import {
    login as loginApi,
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
    logout: () => void;
    updateToken: (token: string) => void;  // để apiClient callback cập nhật
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MeResponse | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function login(email: string, password: string) {
        const response = await loginApi({ email, password });
        setAccessToken(response.accessToken);

        // Lấy user info sau khi có access token
        const me = await getCurrentUser(response.accessToken);
        setUser(me);
    }

    function logout() {
        try { logoutApi(); } catch {}
        setAccessToken(null);
        setUser(null);
    }

    function updateToken(token: string) {
        setAccessToken(token);
    }

    useEffect(() => {
        async function restoreSession() {
            try {
                // Gọi refresh — browser tự gửi cookie HttpOnly
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
                logout,
                updateToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}