import { request } from './client';

export const auditAPI = {
    getLogs: () => request('/api/audit/logs'),
};
