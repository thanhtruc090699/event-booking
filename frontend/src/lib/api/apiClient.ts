const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type ApiClientOptions = RequestInit & {
    token?: string
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    if(!API_BASE_URL) {
        throw new Error("API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
    }

    const { token, headers,...restOptions } = options;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    if(!response.ok){
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
        return undefined as T; // Return undefined for 204 No Content responses
    }

    return response.json() as Promise<T>;
}