import { request } from './client';

function buildUserFormData(dto = {}) {
    if (dto instanceof FormData) return dto;

    const fd = new FormData();
    fd.append('username', dto.username ?? '');
    fd.append('password', dto.password ?? '');
    fd.append('fullName', dto.fullName ?? '');
    fd.append('phone', dto.phone ?? '');

    const roleIds = Array.isArray(dto.roleIds) ? dto.roleIds : (dto.roleIds != null ? [dto.roleIds] : []);
    roleIds
        .filter((id) => id != null && id !== '')
        .forEach((id) => fd.append('roleIds', String(id)));

    if (dto.photo instanceof File) {
        fd.append('photo', dto.photo);
    }

    return fd;
}

export const usersAPI = {
    getAll: () => request('/api/users'),
    getById: (id) => request(`/api/users/${id}`),
    create: (dto) => request('/api/users/create', { method: 'POST', body: buildUserFormData(dto) }),
    update: (id, dto) => request(`/api/users/update/${id}`, { method: 'PUT', body: buildUserFormData(dto) }),
    delete: (id) => request(`/api/users/delete/${id}`, { method: 'DELETE' }),
    changeStatus: (id) => request(`/api/users/change/status/${id}`, { method: 'PUT' }),
};
