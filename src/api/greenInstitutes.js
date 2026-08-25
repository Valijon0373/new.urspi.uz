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
                fd.append(key, val);
            }
        });
    }
    return fd;
}

export const greenInstitutesAPI = {
    getAll: (lang) => lang ? request(`/api/green-institutes/lang/${lang}`) : request('/api/green-institutes'),
    getByLang: (lang) => request(`/api/green-institutes/lang/${lang}`),
    getById: (id) => request(`/api/green-institutes/${id}`),
    create: (data) => request('/api/green-institutes', { method: 'POST', body: ensureFormData(data) }),
    update: (id, data) => request(`/api/green-institutes/${id}`, { method: 'PUT', body: ensureFormData(data) }),
    toggleStatus: (id) => request(`/api/green-institutes/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/green-institutes/${id}`, { method: 'DELETE' }),
};
