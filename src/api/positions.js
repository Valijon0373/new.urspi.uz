import { request } from './client';

export function localizedField(obj, base, lang = 'uz', fallback = '') {
    if (obj == null) return fallback;
    if (typeof obj === 'string') return obj || fallback;
    const code = String(lang || 'uz').slice(0, 2).toLowerCase();
    const cap = code.charAt(0).toUpperCase() + code.slice(1);
    const nested = obj[base];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        const fromNested = nested[code] || nested.uz || nested.ru || nested.en;
        if (fromNested) return fromNested;
    }
    return (
        obj[`${base}${cap}`] ||
        obj[`${base}Uz`] ||
        obj[`${base}Ru`] ||
        obj[`${base}En`] ||
        (typeof nested === 'string' ? nested : '') ||
        fallback
    );
}

export function getPositionName(position, lang = 'uz', fallback = "O'qituvchi") {
    if (position == null || position === '') return fallback;
    if (typeof position === 'string') return position;
    return localizedField(position, 'name', lang, '') || localizedField(position, 'title', lang, fallback);
}

export function resolvePersonPosition(person, lang = 'uz', fallback = "O'qituvchi") {
    if (!person) return fallback;
    const nested = person.position;
    if (nested && typeof nested === 'object') {
        const fromNested = getPositionName(nested, lang, '');
        if (fromNested) return fromNested;
    }
    if (person.positionObj && typeof person.positionObj === 'object') {
        const fromObj = getPositionName(person.positionObj, lang, '');
        if (fromObj) return fromObj;
    }
    const fromTitle = localizedField(person, 'positionTitle', lang, '');
    if (fromTitle) return fromTitle;
    if (typeof nested === 'string' && nested.trim()) return nested;
    return fallback;
}

function collectPositionTexts(person) {
    if (!person) return '';
    if (typeof person === 'string') return person;
    return [
        resolvePersonPosition(person, 'uz', ''),
        resolvePersonPosition(person, 'ru', ''),
        resolvePersonPosition(person, 'en', ''),
        typeof person.position === 'string' ? person.position : '',
        person.positionTitleUz,
        person.positionTitleRu,
        person.positionTitleEn,
        person.positionObj?.nameUz,
        person.positionObj?.titleUz,
        person.position?.nameUz,
        person.position?.titleUz,
        person.raw?.positionTitleUz,
        person.raw?.positionObj?.nameUz,
    ].filter(Boolean).join(' ');
}

function isDeputyRole(text) {
    return /o[''`ʼ‘’]?rinbosar|zamestit|заместител|deputy|vice[\s-]?dean|vice[\s-]?head/i.test(text);
}

export function isDepartmentHead(person) {
    const s = collectPositionTexts(person);
    if (!s || isDeputyRole(s)) return false;
    return /mudir|mudr|мудир|head of (the )?department|department head|chair/i.test(s);
}

export function isFacultyDean(person) {
    const s = collectPositionTexts(person);
    if (!s || isDeputyRole(s)) return false;
    return /dekan|декан|\bdean\b/i.test(s);
}

export function isViceDean(person) {
    const s = collectPositionTexts(person);
    if (!s) return false;
    return /dekan o[''`ʼ‘’]?rinbosar|зам.*декан|заместитель декана|vice[\s-]?dean/i.test(s);
}

export const positionsAPI = {
    getAll: () => request('/api/positions'),
    getById: (id) => request(`/api/positions/${id}`),
    create: (dto) => request('/api/positions', { method: 'POST', body: dto }),
    update: (id, dto) => request(`/api/positions/${id}`, { method: 'PUT', body: dto }),
    toggleStatus: (id) => request(`/api/positions/change/status/${id}`, { method: 'PUT' }),
    delete: (id) => request(`/api/positions/${id}`, { method: 'DELETE' }),
};
