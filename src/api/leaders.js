import { request } from './client';

export const leadersAPI = {
    getAll: (lang) => lang ? request(`/api/leaders/lang/${lang}`) : request('/api/leaders'),
    getById: (id) => request(`/api/leaders/${id}`),
    create: (leaderDto) => request('/api/leaders', { method: 'POST', body: leaderDto }),
    update: (id, leaderDto) => request(`/api/leaders/${id}`, { method: 'PUT', body: leaderDto }),
    toggleStatus: (id) => request(`/api/leaders/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/leaders/${id}`, { method: 'DELETE' }),
};
