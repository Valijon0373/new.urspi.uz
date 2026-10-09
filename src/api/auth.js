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
        if (username) {
            localStorage.setItem('urspi_current_username', username);
            try {
                const localUsers = JSON.parse(localStorage.getItem('urspi_department_users') || '[]');
                const matched = localUsers.find(u => (u.username || '').toLowerCase() === username.toLowerCase());
                const serverUser = res?.user || res?.data?.user || {};
                const merged = matched ? { ...matched, ...serverUser } : (res?.user || res?.data?.user);
                if (merged) {
                    localStorage.setItem('urspi_current_user', JSON.stringify(merged));
                    if (merged.roles) {
                        localStorage.setItem('urspi_current_roles', JSON.stringify(merged.roles));
                    } else if (merged.role) {
                        localStorage.setItem('urspi_current_roles', JSON.stringify([merged.role]));
                    }
                }
            } catch (e) {
                if (res?.user || res?.data?.user) {
                    localStorage.setItem('urspi_current_user', JSON.stringify(res.user || res.data.user));
                }
            }
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
            localStorage.removeItem('urspi_current_username');
            localStorage.removeItem('urspi_current_user');
            localStorage.removeItem('urspi_current_roles');
            localStorage.removeItem('urspi_user_permissions');
            localStorage.removeItem('dashboard-active-tab');
        }
    }
};
