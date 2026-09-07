import { request } from './client';

const toLocalIsoDate = (value = new Date()) => {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

/** Normalize API date (publishedAt / date / createdAt) to yyyy-MM-dd */
export const newsDateIso = (item) => {
    if (item instanceof Date) return toLocalIsoDate(item);
    const raw = typeof item === 'string' ? item : (item?.publishedAt || item?.date || item?.createdAt);
    if (!raw) return '';
    const str = String(raw);
    if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
        const [d, m, y] = str.split('-');
        return `${y}-${m}-${d}`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
    return toLocalIsoDate(str);
};

/** Display date for news cards (dd.MM.yyyy) */
export const formatNewsDate = (item) => {
    const iso = newsDateIso(item);
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
};

export const newsAPI = {
    getAll: (lang) => lang ? request(`/api/news/lang/${lang}`) : request('/api/news'),
    getByLang: (lang) => request(`/api/news/lang/${lang}`),
    getById: (id) => request(`/api/news/${id}`),
    getLanding: (page = 0, size = 10, lang = 'uz') => request(`/api/landing/news?page=${page}&size=${size}&lang=${lang}`),
    getLandingById: (id, lang = 'uz') => request(`/api/landing/news/${id}?lang=${lang}`),
    create: (formData) => request('/api/news', { method: 'POST', body: formData }),
    update: (id, formData) => request(`/api/news/${id}`, { method: 'PUT', body: formData }),
    toggleStatus: (id) => request(`/api/news/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/news/${id}`, { method: 'DELETE' }),
};

