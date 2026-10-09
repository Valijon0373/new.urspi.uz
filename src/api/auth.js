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

        try {
            const rawUser = res?.user || res?.data?.user || res?.userData || null;
            const rolesList = res?.roles || res?.data?.roles || res?.authorities || rawUser?.roles || [];
            const roleName = res?.role || res?.data?.role || rawUser?.role || (Array.isArray(rolesList) && rolesList[0]);
            if (rawUser || roleName || username) {
                const userPayload = {
                    username,
                    fullName: rawUser?.fullName || rawUser?.name || username,
                    role: typeof roleName === 'object' ? (roleName?.name || roleName?.roleName) : roleName,
                    roles: Array.isArray(rolesList) ? rolesList : (roleName ? [roleName] : [])
                };
                sessionStorage.setItem('urspi_auth_user', JSON.stringify(userPayload));
                localStorage.setItem('urspi_auth_user', JSON.stringify(userPayload));
            }
        } catch (e) {}

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
