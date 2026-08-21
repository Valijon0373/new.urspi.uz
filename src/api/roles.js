import { request } from './client';

export const rolesAPI = {
    getAll: () => request('/api/roles'),
    getById: (id) => request(`/api/roles/${id}`),
    create: (dto) => request('/api/roles/create', { method: 'POST', body: dto }),
    update: (id, dto) => request(`/api/roles/update/${id}`, { method: 'PUT', body: dto }),
    delete: (id) => request(`/api/roles/delete/${id}`, { method: 'DELETE' }),
    getPermissionsByRole: (roleId) => request(`/api/roles/${roleId}/permissions`),
    assignPermission: (roleId, permissionId) => request(`/api/roles/${roleId}/permissions/${permissionId}`, { method: 'POST' }),
    removePermission: (roleId, permissionId) => request(`/api/roles/${roleId}/permissions/${permissionId}`, { method: 'DELETE' }),
};

export const permissionsAPI = {
    getAll: () => request('/api/permissions'),
};
