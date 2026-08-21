import { request } from './client';

export const studyYearsAPI = {
    getAll: () => request('/api/study-years'),
    getById: (id) => request(`/api/study-years/${id}`),
    create: (dto) => request('/api/study-years', { method: 'POST', body: dto }),
    toggleStatus: (id) => request(`/api/study-years/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/study-years/${id}`, { method: 'DELETE' }),
};
