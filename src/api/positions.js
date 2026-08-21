import { request } from './client';

export const positionsAPI = {
    getAll: () => request('/api/positions'),
    getById: (id) => request(`/api/positions/${id}`),
    create: (dto) => request('/api/positions', { method: 'POST', body: dto }),
    update: (id, dto) => request(`/api/positions/${id}`, { method: 'PUT', body: dto }),
    toggleStatus: (id) => request(`/api/positions/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/positions/${id}`, { method: 'DELETE' }),
};
