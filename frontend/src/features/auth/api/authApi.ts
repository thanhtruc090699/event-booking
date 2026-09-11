import { apiClient } from "@/lib/api/apiClient";

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type AuthUserDto = {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
};

export type RefreshResponse = {
    accessToken: string;
};

export type RegisterResponse = {
    user: AuthUserDto;
};


export function login(request: LoginRequest) {
    return apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
        credentials: "include", // Include cookies in the request
    });
}

export function register(request: RegisterRequest) {
    return apiClient<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(request),
        credentials: "include", // Include cookies in the request
    });
}

export function refreshAccessToken(){
    return apiClient<RefreshResponse>("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Include cookies in the request
    });
} 

export function logout() {
    return apiClient<void>("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
    });
}

export function getCurrentUser(token: string) {
    return apiClient<AuthUserDto>("/api/auth/me", {
        token,
        credentials: "include", // Include cookies in the request
    });
}