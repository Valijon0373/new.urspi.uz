import { request } from './client';

/**
 * Helper to ensure body is sent as FormData (multipart/form-data)
 */
function ensureFormData(data) {
    if (!data) return data;
    if (data instanceof FormData) return data;
    const fd = new FormData();
    if (typeof data === 'object') {
        Object.entries(data).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        if (v !== undefined && v !== null) {
                            fd.append(key, v);
                        }
                    });
                } else {
                    fd.append(key, val);
                }
            }
        });
    }
    return fd;
}

export const rentalsAPI = {
    getAll: (lang) => lang ? request(`/api/rentals/lang/${lang}`) : request('/api/rentals'),
    getByLang: (lang) => request(`/api/rentals/lang/${lang}`),
    getById: (id) => request(`/api/rentals/${id}`),
    create: (data) => request('/api/rentals', { method: 'POST', body: ensureFormData(data) }),
    update: (id, data) => request(`/api/rentals/${id}`, { method: 'PUT', body: ensureFormData(data) }),
    toggleStatus: (id) => request(`/api/rentals/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/rentals/${id}`, { method: 'DELETE' }),
};
