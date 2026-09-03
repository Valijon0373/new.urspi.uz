import { request } from './client';

export const facultiesAPI = {
    getAll: (lang) => lang ? request(`/api/faculties/lang/${lang}`) : request('/api/faculties'),
    getById: (id) => request(`/api/faculties/${id}`),
    getLanding: (page = 0, size = 50, lang = 'uz') => request(`/api/landing/faculties?page=${page}&size=${size}&lang=${lang}`),
    getLandingById: (id, lang = 'uz') => request(`/api/landing/faculties/${id}?lang=${lang}`),
    getLandingStaff: (facultyId, lang = 'uz', page = 0, size = 50) =>
        request(`/api/landing/faculties/${facultyId}/staff?page=${page}&size=${size}&lang=${lang}`),
    getLandingTeachers: (facultyId, lang = 'uz', page = 0, size = 50) =>
        request(`/api/landing/faculties/${facultyId}/teachers?page=${page}&size=${size}&lang=${lang}`),
    create: (formData) => request('/api/faculties', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/faculties/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/faculties/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/faculties/${id}`, { method: 'DELETE' }),
};
