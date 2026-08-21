import { request, setTokens, clearTokens, getRefreshToken } from './client';

export const authAPI = {
    login: async (username, password) => {
        const res = await request('/api/auth/login', {
            method: 'POST',
            body: { username, password }
        });
        const token = res?.accessToken || res?.token || res?.jwt || res?.jwtToken || res?.data?.accessToken || res?.data?.token;
        const refreshToken = res?.refreshToken || res?.data?.refreshToken;
        if (token) {
            setTokens(token, refreshToken);
        }
        return res;
    },
    refreshToken: async () => {
        const res = await request('/api/auth/refresh', {
            method: 'POST',
            body: { refreshToken: getRefreshToken() }
        });
        const token = res?.accessToken || res?.token || res?.jwt || res?.jwtToken || res?.data?.accessToken || res?.data?.token;
        const refreshToken = res?.refreshToken || res?.data?.refreshToken;
        if (token) {
            setTokens(token, refreshToken);
        }
        return res;
    },
    logout: async () => {
        try {
            await request('/api/auth/logout', { method: 'POST' });
        } finally {
            clearTokens();
        }
    }
};
