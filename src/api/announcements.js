import { request } from './client';

export const announcementsAPI = {
    getAll: (lang) => lang ? request(`/api/announcements/lang/${lang}`) : request('/api/announcements'),
    getById: (id) => request(`/api/announcements/${id}`),
    getLanding: (page = 0, size = 10) => request(`/api/landing/announcements?page=${page}&size=${size}`),
    getLandingById: (id) => request(`/api/landing/announcements/${id}`),
    create: (formData) => request('/api/announcements', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/announcements/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/announcements/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/announcements/${id}`, { method: 'DELETE' }),
};
