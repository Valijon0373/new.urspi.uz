import { request } from './client';

/**
 * Builds JSON payload for FacultyStaffDTO
 */
export function buildFacultyStaffPayload(data = {}) {
    if (data instanceof FormData) return data;
    const {
        fullNameUz = '', fullNameRu = '', fullNameEn = '',
        phoneNumber = '', email = '',
        positionTitleUz = 'Dekan', positionTitleRu = '', positionTitleEn = '',
        sortOrder = 1, facultyId,
    } = data;

    const mainName = fullNameUz || data.fullName || '';
    const mainPos = positionTitleUz || data.positionTitle || 'Dekan';

    const payload = {
        fullNameUz: mainName,
        fullName: mainName,
        fullNameRu,
        fullNameEn,
        phoneNumber,
        email,
        positionTitleUz: mainPos,
        positionTitle: mainPos,
        positionTitleRu,
        positionTitleEn,
        sortOrder: Number(sortOrder) || 1
    };

    if (facultyId != null && facultyId !== '' && String(facultyId) !== 'undefined') {
        payload.facultyId = Number(facultyId) || facultyId;
    }

    return payload;
}

/**
 * Swagger FacultyStaffDTO (multipart/form-data)
 */
export function buildFacultyStaffFormData(data = {}) {
    if (data instanceof FormData) return data;
    const {
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
    } = data;

    const fd = new FormData();
    const mainName = fullNameUz || data.fullName || '';
    const mainPos = positionTitleUz || data.positionTitle || 'Dekan';

    fd.append('fullNameUz', mainName);
    fd.append('fullName', mainName);
    if (fullNameRu) fd.append('fullNameRu', fullNameRu);
    if (fullNameEn) fd.append('fullNameEn', fullNameEn);
    if (phoneNumber) fd.append('phoneNumber', phoneNumber);
    if (email) fd.append('email', email);

    if (photo) {
        if (photo instanceof File) {
            fd.append('photo', photo);
            fd.append('file', photo);
            fd.append('image', photo);
        } else if (typeof photo === 'string' && photo) {
            fd.append('photo', photo);
            fd.append('photoLink', photo);
            fd.append('image', photo);
        }
    }
    if (cv) {
        if (cv instanceof File) {
            fd.append('cv', cv);
            fd.append('fileCv', cv);
        } else if (typeof cv === 'string' && cv) {
            fd.append('cv', cv);
        }
    }

    fd.append('positionTitleUz', mainPos);
    fd.append('positionTitle', mainPos);
    if (positionTitleRu) fd.append('positionTitleRu', positionTitleRu);
    if (positionTitleEn) fd.append('positionTitleEn', positionTitleEn);
    fd.append('sortOrder', String(sortOrder != null && sortOrder !== '' ? sortOrder : 1));

    if (facultyId != null && facultyId !== '' && String(facultyId) !== 'undefined') {
        fd.append('facultyId', String(facultyId));
    }

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
    create: async (data) => {
        if (data instanceof FormData) {
            return request('/api/faculty-staff', { method: 'POST', body: data });
        }
        const formData = buildFacultyStaffFormData(data);
        try {
            return await request('/api/faculty-staff', { method: 'POST', body: formData });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const payload = buildFacultyStaffPayload(data);
                return await request('/api/faculty-staff', { method: 'POST', body: payload });
            }
            throw err;
        }
    },
    update: async (id, data) => {
        if (data instanceof FormData) {
            return request(`/api/faculty-staff/${id}`, { method: 'PUT', body: data });
        }
        const formData = buildFacultyStaffFormData(data);
        try {
            return await request(`/api/faculty-staff/${id}`, { method: 'PUT', body: formData });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const payload = buildFacultyStaffPayload(data);
                return await request(`/api/faculty-staff/${id}`, { method: 'PUT', body: payload });
            }
            throw err;
        }
    },
    toggleStatus: (id) => request(`/api/faculty-staff/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/faculty-staff/${id}`, { method: 'DELETE' }),
};

