import { request } from './client';

export const newsAPI = {
    getAll: (lang) => lang ? request(`/api/news/lang/${lang}`) : request('/api/news'),
    getByLang: (lang) => request(`/api/news/lang/${lang}`),
    getById: (id) => request(`/api/news/${id}`),
    getLanding: (page = 0, size = 10) => request(`/api/landing/news?page=${page}&size=${size}`),
    getLandingById: (id) => request(`/api/landing/news/${id}`),
    create: (formData) => request('/api/news', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/news/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/news/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/news/${id}`, { method: 'DELETE' }),
};

