import { request } from './client';

/**
 * Builds JSON payload for TeacherDTO
 */
export function buildTeacherPayload(data = {}) {
    if (data instanceof FormData) return data;
    const {
        fullNameUz = '', fullNameRu = '', fullNameEn = '',
        phoneNumber = '', email = '',
        facultyId, departmentId, positionId, academicDegreeId,
        positionTitleUz = '', positionTitleRu = '', positionTitleEn = '',
        sortOrder = 0
    } = data;

    const mainName = fullNameUz || data.fullName || '';

    const payload = {
        fullNameUz: mainName,
        fullName: mainName,
        fullNameRu,
        fullNameEn,
        phoneNumber,
        email,
        sortOrder: Number(sortOrder) || 0
    };

    if (facultyId != null && facultyId !== '' && String(facultyId) !== 'undefined') {
        payload.facultyId = Number(facultyId) || facultyId;
    }
    if (departmentId != null && departmentId !== '' && String(departmentId) !== 'undefined') {
        payload.departmentId = Number(departmentId) || departmentId;
    }
    if (positionId != null && positionId !== '' && String(positionId) !== 'undefined') {
        payload.positionId = Number(positionId) || positionId;
    }
    if (academicDegreeId != null && academicDegreeId !== '' && String(academicDegreeId) !== 'undefined') {
        payload.academicDegreeId = Number(academicDegreeId) || academicDegreeId;
    }
    if (positionTitleUz) {
        payload.positionTitleUz = positionTitleUz;
        payload.positionTitle = positionTitleUz;
    }
    if (positionTitleRu) payload.positionTitleRu = positionTitleRu;
    if (positionTitleEn) payload.positionTitleEn = positionTitleEn;

    return payload;
}

/**
 * Swagger TeacherDTO (multipart/form-data) ga mos FormData yig'uvchi.
 */
export function buildTeacherFormData(data = {}) {
    if (data instanceof FormData) return data;
    const {
        fullNameUz,
        fullNameRu,
        fullNameEn,
        phoneNumber,
        email,
        facultyId,
        departmentId,
        positionId,
        academicDegreeId,
        positionTitleUz,
        positionTitleRu,
        positionTitleEn,
        photo,
        cv,
        sortOrder = 0,
    } = data;

    const fd = new FormData();
    const mainName = fullNameUz || data.fullName || '';
    fd.append('fullNameUz', mainName);
    fd.append('fullName', mainName);
    if (fullNameRu) fd.append('fullNameRu', fullNameRu);
    if (fullNameEn) fd.append('fullNameEn', fullNameEn);
    if (phoneNumber) fd.append('phoneNumber', phoneNumber);
    if (email) fd.append('email', email);

    if (facultyId != null && facultyId !== '' && String(facultyId) !== 'undefined') {
        fd.append('facultyId', String(facultyId));
    }
    if (departmentId != null && departmentId !== '' && String(departmentId) !== 'undefined') {
        fd.append('departmentId', String(departmentId));
    }
    if (positionId != null && positionId !== '' && String(positionId) !== 'undefined') {
        fd.append('positionId', String(positionId));
    }
    if (academicDegreeId != null && academicDegreeId !== '' && String(academicDegreeId) !== 'undefined') {
        fd.append('academicDegreeId', String(academicDegreeId));
    }

    if (positionTitleUz) {
        fd.append('positionTitleUz', positionTitleUz);
        fd.append('positionTitle', positionTitleUz);
    }
    if (positionTitleRu) fd.append('positionTitleRu', positionTitleRu);
    if (positionTitleEn) fd.append('positionTitleEn', positionTitleEn);

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

    if (sortOrder != null && sortOrder !== '') {
        fd.append('sortOrder', String(sortOrder));
    }

    return fd;
}

export const teachersAPI = {
    getAll: (lang) => lang ? request(`/api/teachers/lang/${lang}`) : request('/api/teachers'),
    getLanding: (page = 0, size = 50, lang = 'uz') => request(`/api/landing/teachers?page=${page}&size=${size}&lang=${lang}`),
    getLandingById: (id, lang = 'uz') => request(`/api/landing/teachers/${id}?lang=${lang}`),
    getByFaculty: (facultyId) => request(`/api/teachers/faculty/${facultyId}`),
    getByDepartment: (departmentId, lang = 'uz') => 
        request(`/api/landing/departments/${departmentId}/teachers?page=0&size=100&lang=${lang}`),
    getLandingByDepartment: (departmentId, page = 0, size = 100, lang = 'uz') => 
        request(`/api/landing/departments/${departmentId}/teachers?page=${page}&size=${size}&lang=${lang}`),
    getByFacultyAndDepartment: (facultyId, departmentId, lang) => lang 
        ? request(`/api/teachers/faculty/${facultyId}/department/${departmentId}/lang/${lang}`)
        : request(`/api/teachers/faculty/${facultyId}/department/${departmentId}`),
    getByPosition: (positionId) => request(`/api/teachers/position/${positionId}`),
    getByAcademicDegree: (academicDegreeId) => request(`/api/teachers/academic-degree/${academicDegreeId}`),
    getById: (id) => request(`/api/teachers/${id}`),
    create: async (data) => {
        if (data instanceof FormData) {
            return request('/api/teachers', { method: 'POST', body: data });
        }
        const formData = buildTeacherFormData(data);
        try {
            return await request('/api/teachers', { method: 'POST', body: formData });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const payload = buildTeacherPayload(data);
                return await request('/api/teachers', { method: 'POST', body: payload });
            }
            throw err;
        }
    },
    update: async (id, data) => {
        if (data instanceof FormData) {
            return request(`/api/teachers/${id}`, { method: 'PUT', body: data });
        }
        const formData = buildTeacherFormData(data);
        try {
            return await request(`/api/teachers/${id}`, { method: 'PUT', body: formData });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const payload = buildTeacherPayload(data);
                return await request(`/api/teachers/${id}`, { method: 'PUT', body: payload });
            }
            throw err;
        }
    },
    toggleStatus: (id) => request(`/api/teachers/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/teachers/${id}`, { method: 'DELETE' }),
};

