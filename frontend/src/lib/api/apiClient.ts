const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiClientOptions = RequestInit & {
    token?: string;
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(newToken: string) {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not defined.");
    }

    const { token, headers, ...restOptions } = options;

    async function doFetch(authToken?: string) {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...restOptions,
            headers: {
                "Content-Type": "application/json",
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                ...headers,
            },
        });
    }

    let response = await doFetch(token);

    // Auto-refresh: nếu nhận 401 VÀ có token VÀ không phải request auth
    if (response.status === 401 && token && !endpoint.includes("/api/auth/")) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                // Gọi refresh — browser tự gửi cookie
                const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                });

                if (refreshResponse.ok) {
                    const { accessToken: newToken } = await refreshResponse.json();
                    onTokenRefreshed(newToken);
                    response = await doFetch(newToken);
                }
            } finally {
                isRefreshing = false;
            }
        } else {
            // Đang refresh → chờ token mới rồi retry
            response = await new Promise<Response>((resolve) => {
                refreshSubscribers.push(async (newToken) => {
                    resolve(await doFetch(newToken));
                });
            });
        }
    }

    if (!response.ok) {
        throw new Error(`API failed ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}