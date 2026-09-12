import { apiClient } from "@/lib/api/apiClient";

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    fullName: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
};

export type MeResponse = {
    customerId: number;
    email: string;
    fullName: string;
};

export type RefreshResponse = {
    accessToken: string;
};

export type RegisterResponse = {
    customerId: number;
    email: string;
    fullName: string;
};


export function login(request: LoginRequest) {
    return apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
        credentials: "include", // Browser will send HttpOnly refresh token cookie automatically with this request
    });
}

export function register(request: RegisterRequest) {
    return apiClient<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(request),
        credentials: "include", // Browser will send HttpOnly refresh token cookie automatically with this request
    });
}

export function refreshAccessToken(){
    return apiClient<RefreshResponse>("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Browser will send HttpOnly refresh token cookie automatically with this request
    });
} 

export function logout() {
    return apiClient<void>("/api/auth/logout", {
        method: "POST",
        credentials: "include", // browser will send cookie -> backend will delete it
    });
}

export function getCurrentUser(token: string) {
    return apiClient<MeResponse>("/api/auth/me", {
        token,
    });
}