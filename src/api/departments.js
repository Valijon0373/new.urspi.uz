import { request } from './client';

export const departmentsAPI = {
    getAll: (lang) => lang ? request(`/api/departments/lang/${lang}`) : request('/api/departments'),
    getByFaculty: (facultyId, lang) => lang 
        ? request(`/api/departments/faculty/${facultyId}/lang/${lang}`) 
        : request(`/api/departments/faculty/${facultyId}`),
    getById: (id) => request(`/api/departments/${id}`),
    getLanding: (page = 0, size = 50) => request(`/api/landing/departments?page=${page}&size=${size}`),
    getLandingById: (id) => request(`/api/landing/departments/${id}`),
    create: (deptDto) => request('/api/departments', { method: 'POST', body: deptDto }),
    update: (id, deptDto) => request(`/api/departments/${id}`, { method: 'PUT', body: deptDto }),
    toggleStatus: (id) => request(`/api/departments/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/departments/${id}`, { method: 'DELETE' }),
};
