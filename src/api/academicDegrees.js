import { request } from './client';

export const academicDegreesAPI = {
    getAll: () => request('/api/academic-degrees'),
    getById: (id) => request(`/api/academic-degrees/${id}`),
    create: (dto) => request('/api/academic-degrees', { method: 'POST', body: dto }),
    update: (id, dto) => request(`/api/academic-degrees/${id}`, { method: 'PUT', body: dto }),
    toggleStatus: (id) => request(`/api/academic-degrees/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/academic-degrees/${id}`, { method: 'DELETE' }),
};
