import { request } from './client';

/**
 * Swagger FacultyStaffDTO (multipart/form-data)
 * Fields:
 * - fullNameUz (required)
 * - fullNameRu, fullNameEn
 * - phoneNumber, email
 * - photo (binary), cv (binary)
 * - positionTitleUz (required), positionTitleRu, positionTitleEn
 * - sortOrder (integer)
 * - facultyId (required integer)
 */
export function buildFacultyStaffFormData({
    fullNameUz,
    fullNameRu,
    fullNameEn,
    phoneNumber,
    email,
    photo,
    cv,
    positionTitleUz,
    positionTitleRu,
    positionTitleEn,
    sortOrder = 1,
    facultyId,
}) {
    const fd = new FormData();
    fd.append('fullNameUz', fullNameUz || '');
    fd.append('fullName', fullNameUz || ''); // Legacy DB fallback
    if (fullNameRu) fd.append('fullNameRu', fullNameRu);
    if (fullNameEn) fd.append('fullNameEn', fullNameEn);
    if (phoneNumber) fd.append('phoneNumber', phoneNumber);
    if (email) fd.append('email', email);
    if (photo) {
        fd.append('photo', photo);
        fd.append('file', photo);
        fd.append('image', photo);
    }
    if (cv) fd.append('cv', cv);
    fd.append('positionTitleUz', positionTitleUz || 'Dekan');
    if (positionTitleRu) fd.append('positionTitleRu', positionTitleRu);
    if (positionTitleEn) fd.append('positionTitleEn', positionTitleEn);
    fd.append('sortOrder', String(sortOrder != null && sortOrder !== '' ? sortOrder : 1));
    if (facultyId) fd.append('facultyId', String(facultyId));
    return fd;
}

export const facultyStaffAPI = {
    getAll: (lang) => lang ? request(`/api/faculty-staff/lang/${lang}`) : request('/api/faculty-staff'),
    getById: (id) => request(`/api/faculty-staff/${id}`),
    /** GET /api/landing/faculty-staff/{id}?lang=uz — bitta hodim */
    getLandingById: (id, lang = 'uz') => request(`/api/landing/faculty-staff/${id}?lang=${lang}`),
    /** GET /api/landing/faculty-staff?page=&size=&lang= — barcha hodimlar (pageable) */
    getLanding: (page = 0, size = 50, lang = 'uz') =>
        request(`/api/landing/faculty-staff?page=${page}&size=${size}&lang=${lang}`),
    /** GET /api/landing/faculties/{facultyId}/staff — fakultet dekanati */
    getByFaculty: (facultyId, lang = 'uz') =>
        request(`/api/landing/faculties/${facultyId}/staff?page=0&size=50&lang=${lang}`),
    getByFacultyLang: (facultyId, lang) =>
        request(`/api/faculty-staff/faculty/${facultyId}/lang/${lang}`),
    create: (formData) => request('/api/faculty-staff', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/faculty-staff/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/faculty-staff/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/faculty-staff/${id}`, { method: 'DELETE' }),
};
