import { request } from './client';

export const teachersAPI = {
    getAll: (lang) => lang ? request(`/api/teachers/lang/${lang}`) : request('/api/teachers'),
    getByFaculty: (facultyId) => request(`/api/teachers/faculty/${facultyId}`),
    getByDepartment: (departmentId) => request(`/api/teachers/department/${departmentId}`),
    getByFacultyAndDepartment: (facultyId, departmentId, lang) => lang 
        ? request(`/api/teachers/faculty/${facultyId}/department/${departmentId}/lang/${lang}`)
        : request(`/api/teachers/faculty/${facultyId}/department/${departmentId}`),
    getByPosition: (positionId) => request(`/api/teachers/position/${positionId}`),
    getByAcademicDegree: (academicDegreeId) => request(`/api/teachers/academic-degree/${academicDegreeId}`),
    getById: (id) => request(`/api/teachers/${id}`),
    create: (formData) => request('/api/teachers', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/teachers/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/teachers/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/teachers/${id}`, { method: 'DELETE' }),
};
