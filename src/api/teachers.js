import { request } from './client';

/**
 * Swagger TeacherDTO (multipart/form-data) ga mos FormData yig'uvchi.
 * Qo'shimcha: backend DB dagi legacy `full_name` ustuni (NOT NULL) — Swagger da
 * ko'rsatilmagan, lekin entity saqlashda talab qilinadi.
 */
export function buildTeacherFormData({
    fullNameUz,
    fullNameRu,
    fullNameEn,
    phoneNumber,
    email,
    facultyId,
    departmentId,
    positionId,
    academicDegreeId,
    photo,
    cv,
    sortOrder = 0,
}) {
    const fd = new FormData();
    fd.append('fullNameUz', fullNameUz);
    // Legacy DB column workaround — backend fullNameUz → full_name map qilmayapti
    fd.append('fullName', fullNameUz);
    if (fullNameRu) fd.append('fullNameRu', fullNameRu);
    if (fullNameEn) fd.append('fullNameEn', fullNameEn);
    fd.append('phoneNumber', phoneNumber);
    fd.append('email', email);
    fd.append('facultyId', String(facultyId));
    fd.append('departmentId', String(departmentId));
    fd.append('positionId', String(positionId));
    fd.append('academicDegreeId', String(academicDegreeId));
    if (photo) fd.append('photo', photo);
    if (cv) fd.append('cv', cv);
    if (sortOrder != null && sortOrder !== '') fd.append('sortOrder', String(sortOrder));
    return fd;
}

export const teachersAPI = {
    getAll: (lang) => lang ? request(`/api/teachers/lang/${lang}`) : request('/api/teachers'),
    getLanding: (page = 0, size = 50, lang = 'uz') => request(`/api/landing/teachers?page=${page}&size=${size}&lang=${lang}`),
    getLandingById: (id, lang = 'uz') => request(`/api/landing/teachers/${id}?lang=${lang}`),
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
