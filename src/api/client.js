/**
 * Central API Client and Token Helpers
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getAuthToken = () => localStorage.getItem('urspi_access_token') || '';
export const getRefreshToken = () => localStorage.getItem('urspi_refresh_token') || '';

export const setTokens = (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('urspi_access_token', accessToken);
    if (refreshToken) localStorage.setItem('urspi_refresh_token', refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem('urspi_access_token');
    localStorage.removeItem('urspi_refresh_token');
};

/**
 * Resolves full image/file URL from backend file paths or filenames
 */
export const getFileUrl = (link) => {
    if (!link) return '';
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('data:') || link.startsWith('blob:')) {
        return link;
    }
    if (link.startsWith('/api/files/')) {
        return `${BASE_URL}${link}`;
    }
    if (link.startsWith('/')) {
        return `${BASE_URL}${link}`;
    }
    return `${BASE_URL}/api/files/${link}`;
};

/**
 * Central API request helper
 */
export async function request(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = options.headers ? { ...options.headers } : {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    const config = {
        method: options.method || 'GET',
        headers,
        body,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle 401 (Invalid/expired token)
    if (response.status === 401 && endpoint !== '/api/auth/login' && endpoint !== '/api/auth/refresh') {
        let retried = false;
        if (getRefreshToken()) {
            try {
                const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: getRefreshToken() })
                });
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    if (refreshData.accessToken) {
                        setTokens(refreshData.accessToken, refreshData.refreshToken);
                        config.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
                        response = await fetch(`${BASE_URL}${endpoint}`, config);
                        retried = true;
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        if (!retried) {
            clearTokens();
            // If GET request, retry without invalid token for public endpoints
            if ((options.method || 'GET').toUpperCase() === 'GET') {
                delete config.headers['Authorization'];
                response = await fetch(`${BASE_URL}${endpoint}`, config);
            }
        }
    }

    if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        try {
            const errJson = await response.json();
            if (Array.isArray(errJson.errors) && errJson.errors.length > 0) {
                errorMessage = errJson.errors.map((e) => e.message || e.defaultMessage || e.field).join(', ');
            } else if (errJson.message) {
                errorMessage = errJson.message;
            } else if (errJson.error) {
                errorMessage = errJson.error;
            }
            if (response.status === 401) {
                errorMessage = 'Avtorizatsiya talab qilinadi. /admin sahifasidan qayta kiring.';
            } else if (response.status === 403) {
                errorMessage = errorMessage || 'Bu amal uchun ruxsatingiz yo\'q.';
            }
        } catch (e) {
            // ignore parsing error
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return await response.text();
}
