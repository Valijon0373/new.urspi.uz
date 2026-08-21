import { request } from './client';

export const employeesAPI = {
    getAll: (lang) => lang ? request(`/api/employees/lang/${lang}`) : request('/api/employees'),
    getByCenter: (centerId, lang) => request(`/api/employees/center/${centerId}/lang/${lang}`),
    getById: (id) => request(`/api/employees/${id}`),
    create: (formData) => request('/api/employees', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/employees/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/employees/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/employees/${id}`, { method: 'DELETE' }),
};
