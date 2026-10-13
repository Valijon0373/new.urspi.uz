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

export const dormitoriesAPI = {
    getLanding: (page = 0, size = 100, lang = 'uz') =>
        request(`/api/landing/dormitories?page=${page}&size=${size}&lang=${lang}`),
    getLandingById: (id, lang = 'uz') =>
        request(`/api/landing/dormitories/${id}?lang=${lang}`),
    getAll: (lang) => lang ? request(`/api/dormitories/lang/${lang}`) : request('/api/dormitories'),
    getByLang: (lang) => request(`/api/dormitories/lang/${lang}`),
    getById: (id) => request(`/api/dormitories/${id}`),
    create: (data) => request('/api/dormitories', { method: 'POST', body: ensureFormData(data) }),
    update: (id, data) => request(`/api/dormitories/${id}`, { method: 'PUT', body: ensureFormData(data) }),
    toggleStatus: (id) => request(`/api/dormitories/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/dormitories/${id}`, { method: 'DELETE' }),
};
