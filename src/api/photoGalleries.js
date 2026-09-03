import { request } from './client';

/**
 * Helper to ensure body is sent as FormData (multipart/form-data)
 * Backend Spring controller for photo-galleries uses @ModelAttribute / multipart form-data.
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

export const photoGalleriesAPI = {
    getAll: (lang) => lang ? request(`/api/photo-galleries/lang/${lang}`) : request('/api/photo-galleries'),
    getByLang: (lang) => request(`/api/photo-galleries/lang/${lang}`),
    getLanding: (page = 0, size = 20, lang = 'uz') => request(`/api/landing/photo-galleries?page=${page}&size=${size}&lang=${lang}`),
    getById: (id) => request(`/api/photo-galleries/${id}`),
    create: (data) => request('/api/photo-galleries', { method: 'POST', body: ensureFormData(data) }),
    update: (id, data) => request(`/api/photo-galleries/${id}`, { method: 'PUT', body: ensureFormData(data) }),
    toggleStatus: (id) => request(`/api/photo-galleries/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/photo-galleries/${id}`, { method: 'DELETE' }),
};
