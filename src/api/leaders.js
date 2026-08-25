import { request } from './client';

export function buildLeaderPayload(data) {
    if (!data) return data;
    const {
        fullNameUz = '', fullNameRu = '', fullNameEn = '',
        positionTitleUz = '', positionTitleRu = '', positionTitleEn = '',
        addressUz = '', addressRu = '', addressEn = '',
        receptionTimeUz = '', receptionTimeRu = '', receptionTimeEn = '',
        email = '', phoneNumber = '', phone = '',
        photoLink = '', photo = ''
    } = data;

    const mainName = fullNameUz || data.fullName || '';
    const mainPos = positionTitleUz || data.positionTitle || '';
    const mainAddr = addressUz || data.address || '';
    const mainRec = receptionTimeUz || data.receptionTime || '';
    const mainPhone = phoneNumber || phone || '';
    const mainPhoto = photoLink || (typeof photo === 'string' ? photo : '');

    return {
        fullNameUz: mainName,
        fullNameRu,
        fullNameEn,
        positionTitleUz: mainPos,
        positionTitleRu,
        positionTitleEn,
        addressUz: mainAddr,
        addressRu,
        addressEn,
        receptionTimeUz: mainRec,
        receptionTimeRu,
        receptionTimeEn,
        
        // Legacy / non-suffixed fields required by backend DB validation
        fullName: mainName,
        positionTitle: mainPos,
        address: mainAddr,
        receptionTime: mainRec,
        email,
        phoneNumber: mainPhone,
        phone: mainPhone,
        photoLink: mainPhoto,
        photo: mainPhoto
    };
}

export function buildLeaderFormData(data) {
    if (!data) return data;
    if (data instanceof FormData) return data;
    
    const payload = buildLeaderPayload(data);
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null && !(v instanceof File)) {
            fd.append(k, v);
        }
    });

    if (data.photo instanceof File) {
        fd.append('photo', data.photo);
        fd.append('file', data.photo);
    } else if (data.file instanceof File) {
        fd.append('photo', data.file);
        fd.append('file', data.file);
    }

    return fd;
}

export const leadersAPI = {
    getAll: (lang) => lang ? request(`/api/leaders/lang/${lang}`) : request('/api/leaders'),
    getLanding: (page = 0, size = 50) => request(`/api/landing/leaders?page=${page}&size=${size}`),
    getLandingById: (id) => request(`/api/landing/leaders/${id}`),
    getById: (id) => request(`/api/leaders/${id}`),
    create: async (data) => {
        if (data instanceof FormData) {
            return request('/api/leaders', { method: 'POST', body: data });
        }
        const payload = buildLeaderPayload(data);
        try {
            return await request('/api/leaders', { method: 'POST', body: payload });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const formData = buildLeaderFormData(data);
                return await request('/api/leaders', { method: 'POST', body: formData });
            }
            throw err;
        }
    },
    update: async (id, data) => {
        if (data instanceof FormData) {
            return request(`/api/leaders/${id}`, { method: 'PUT', body: data });
        }
        const payload = buildLeaderPayload(data);
        try {
            return await request(`/api/leaders/${id}`, { method: 'PUT', body: payload });
        } catch (err) {
            if (err.message && (err.message.includes('400') || err.message.includes('415') || err.message.includes('Content'))) {
                const formData = buildLeaderFormData(data);
                return await request(`/api/leaders/${id}`, { method: 'PUT', body: formData });
            }
            throw err;
        }
    },
    toggleStatus: (id) => request(`/api/leaders/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/leaders/${id}`, { method: 'DELETE' }),
};

