"use client";

import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    login as loginApi,
    getCurrentUser,
    refreshAccessToken,
    type AuthUserDto,
} from "../api/authApi";

interface AuthContextType {
    user: AuthUserDto | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<AuthUserDto | null>(null);

    const [accessToken, setAccessToken] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    async function login(
        email: string,
        password: string
    ) {
        const response = await loginApi({
            email,
            password,
        });

        setAccessToken(response.accessToken);

        setUser(response.user);
    }

    function logout() {
        setAccessToken(null);
        setUser(null);
    }

    useEffect(() => {
        async function restoreSession() {
            try {
                const refreshResponse =
                    await refreshAccessToken();

                const newAccessToken =
                    refreshResponse.accessToken;

                setAccessToken(newAccessToken);

                const currentUser =
                    await getCurrentUser(newAccessToken);

                setUser(currentUser);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}