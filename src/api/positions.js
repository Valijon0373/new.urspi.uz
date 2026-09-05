import { request } from './client';

export function localizedField(obj, base, lang = 'uz', fallback = '') {
    if (obj == null) return fallback;
    if (typeof obj === 'string') return obj || fallback;
    const code = String(lang || 'uz').slice(0, 2).toLowerCase();
    const cap = code.charAt(0).toUpperCase() + code.slice(1);

    // 1. Check nested object: e.g. obj[base][code] (obj.title.ru, obj.name.en)
    const nested = obj[base];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        const fromNested = nested[code] || nested[code.toUpperCase()] || nested.uz || nested.ru || nested.en;
        if (fromNested && typeof fromNested === 'string' && fromNested.trim()) return fromNested;
    }

    // 2. Check exact property matching requested language: e.g. titleRu, nameRu, fullNameRu, descriptionRu, contentRu
    const keyWithCap = `${base}${cap}`;
    if (obj[keyWithCap] && typeof obj[keyWithCap] === 'string' && obj[keyWithCap].trim()) {
        return obj[keyWithCap];
    }
    const snakeKey = `${base}_${code}`;
    if (obj[snakeKey] && typeof obj[snakeKey] === 'string' && obj[snakeKey].trim()) {
        return obj[snakeKey];
    }

    // 3. Fallback to Uzbek: baseUz or base_uz
    const uzKey = `${base}Uz`;
    if (obj[uzKey] && typeof obj[uzKey] === 'string' && obj[uzKey].trim()) {
        return obj[uzKey];
    }
    const snakeUz = `${base}_uz`;
    if (obj[snakeUz] && typeof obj[snakeUz] === 'string' && obj[snakeUz].trim()) {
        return obj[snakeUz];
    }

    // 4. Fallback to plain string property: e.g. obj[base] (landing API responses)
    if (typeof nested === 'string' && nested.trim()) return nested;
    if (obj[base] && typeof obj[base] === 'string' && obj[base].trim()) return obj[base];

    // 5. Fallback to Russian or English
    const ruKey = `${base}Ru`;
    if (obj[ruKey] && typeof obj[ruKey] === 'string' && obj[ruKey].trim()) return obj[ruKey];
    const enKey = `${base}En`;
    if (obj[enKey] && typeof obj[enKey] === 'string' && obj[enKey].trim()) return obj[enKey];

    return fallback;
}

export function getPositionName(position, lang = 'uz', fallback = "O'qituvchi") {
    if (position == null || position === '') return fallback;
    if (typeof position === 'string') return position;
    return localizedField(position, 'name', lang, '') || localizedField(position, 'title', lang, fallback);
}

export function resolvePersonPosition(person, lang = 'uz', fallback = "O'qituvchi") {
    if (!person) return fallback;

    if (isFacultyDean(person)) {
        return lang === 'ru' ? "Декан факультета" : lang === 'en' ? "Dean of Faculty" : "Fakultet dekani";
    }
    if (isDepartmentHead(person)) {
        return lang === 'ru' ? "Заведующий кафедрой" : lang === 'en' ? "Head of Department" : "Kafedra mudiri";
    }

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
    const nested = (person.position && typeof person.position === 'object') ? person.position : {};
    const posObj = (person.positionObj && typeof person.positionObj === 'object') ? person.positionObj : {};
    const raw = (person.raw && typeof person.raw === 'object') ? person.raw : {};

    return [
        typeof person.position === 'string' ? person.position : '',
        person.positionTitle,
        person.positionTitleUz,
        person.positionTitleRu,
        person.positionTitleEn,
        nested.name,
        nested.nameUz,
        nested.nameRu,
        nested.nameEn,
        nested.title,
        nested.titleUz,
        nested.titleRu,
        nested.titleEn,
        posObj.name,
        posObj.nameUz,
        posObj.nameRu,
        posObj.nameEn,
        posObj.title,
        posObj.titleUz,
        raw.positionTitle,
        raw.positionTitleUz,
        raw.positionObj?.nameUz,
        raw.position?.nameUz,
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
