import { request } from './client';

export const centersAPI = {
    getAll: (lang) => lang ? request(`/api/centers/lang/${lang}`) : request('/api/centers'),
    getById: (id) => request(`/api/centers/${id}`),
    create: (centerDto) => request('/api/centers', { method: 'POST', body: centerDto }),
    update: (id, centerDto) => request(`/api/centers/${id}`, { method: 'PUT', body: centerDto }),
    toggleStatus: (id) => request(`/api/centers/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/centers/${id}`, { method: 'DELETE' }),
};
