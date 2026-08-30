export type UserRole = "CUSTOMER" | "ORGANIZER";

export type MockUser = {
    authenticated: boolean;
    roles: UserRole[];
    initials: string;
};

const AUTH_STORAGE_KEY = "stagepass_mock_user";

export const guestUser: MockUser = {
    authenticated: false,
    roles: [],
    initials: "",
};

export const demoUser: MockUser = {
    authenticated: true,
    roles: ["CUSTOMER", "ORGANIZER"],
    initials: "TN",
};

export function getMockUser(): MockUser {
    if (typeof window === "undefined") {
        return guestUser;
    }

    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
        return guestUser;
    }

    try {
        return JSON.parse(storedUser) as MockUser;
    } catch {
        return guestUser;
    }
}

export function signInMockUser() {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event("stagepass-auth-changed"));
}

export function signOutMockUser() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("stagepass-auth-changed"));
}