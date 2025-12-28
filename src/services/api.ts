
export const BASE_URL = 'http://72.61.202.174:4000/api/v1'; // Live backend
// export const BASE_URL = 'http://localhost:4000/api/v1'; // Local backend


interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}, isBlob = false): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            // Optional: handle unauthorized
        }

        if (isBlob) {
            if (!response.ok) throw new Error('Download failed');
            return await response.blob() as unknown as T;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Something went wrong');
        }

        return data as T;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, headers: Record<string, string> = {}) => request<T>(endpoint, { method: 'GET', headers }),
    post: <T>(endpoint: string, body: any, headers: Record<string, string> = {}) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),
    put: <T>(endpoint: string, body: any, headers: Record<string, string> = {}) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
    patch: <T>(endpoint: string, body: any, headers: Record<string, string> = {}) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers }),
    delete: <T>(endpoint: string, headers: Record<string, string> = {}) => request<T>(endpoint, { method: 'DELETE', headers }),
    download: (endpoint: string) => request<Blob>(endpoint, { method: 'GET' }, true),
};

