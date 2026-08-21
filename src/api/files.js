import { request, getFileUrl } from './client';

export const filesAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/files/upload', { method: 'POST', body: formData });
    },
    delete: (fileName) => request(`/api/files/${fileName}`, { method: 'DELETE' }),
    getUrl: getFileUrl
};
