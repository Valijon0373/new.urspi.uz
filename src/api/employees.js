import { request } from './client';

/**
 * Employee create/update FormData (Swagger EmployeeDTO + legacy full_name workaround)
 */
export function buildEmployeeFormData({
    fullNameUz,
    fullNameRu,
    fullNameEn,
    phoneNumber,
    email,
    positionTitleUz,
    positionTitleRu,
    positionTitleEn,
    centerId,
    photo,
    cv,
    sortOrder = 0,
}) {
    const fd = new FormData();
    fd.append('fullNameUz', fullNameUz);
    fd.append('fullName', fullNameUz);
    if (fullNameRu) fd.append('fullNameRu', fullNameRu);
    if (fullNameEn) fd.append('fullNameEn', fullNameEn);
    fd.append('phoneNumber', phoneNumber);
    fd.append('email', email);
    fd.append('positionTitleUz', positionTitleUz);
    if (positionTitleRu) fd.append('positionTitleRu', positionTitleRu);
    if (positionTitleEn) fd.append('positionTitleEn', positionTitleEn);
    fd.append('centerId', String(centerId));
    if (photo) fd.append('photo', photo);
    if (cv) fd.append('cv', cv);
    if (sortOrder != null && sortOrder !== '') fd.append('sortOrder', String(sortOrder));
    return fd;
}

export const employeesAPI = {
    getAll: (lang) => lang ? request(`/api/employees/lang/${lang}`) : request('/api/employees'),
    getLanding: (page = 0, size = 50) => request(`/api/landing/employees?page=${page}&size=${size}`),
    getByCenter: (centerId, lang) => request(`/api/employees/center/${centerId}/lang/${lang}`),
    getById: (id) => request(`/api/employees/${id}`),
    create: (formData) => request('/api/employees', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/employees/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/employees/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/employees/${id}`, { method: 'DELETE' }),
};
