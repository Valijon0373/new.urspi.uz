import { request } from './client.js';

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

export const POSITION_DICTIONARY = {
    // Leadership / Administration
    "rektor": { uz: "Rektor", ru: "Ректор", en: "Rector" },
    "birinchi prorektor": { uz: "Birinchi prorektor", ru: "Первый проректор", en: "First Vice-Rector" },
    "yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor": {
        uz: "Yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor",
        ru: "Первый проректор по делам молодежи и духовно-просветительской работе",
        en: "First Vice-Rector for Youth Affairs and Spiritual-Educational Work"
    },
    "yoshlar masalalari va ma'naviyat bo'yicha prorektor": {
        uz: "Yoshlar masalalari va ma'naviyat bo'yicha prorektor",
        ru: "Проректор по работе с молодежью",
        en: "Vice-Rector for Youth Affairs"
    },
    "o'quv ishlari bo'yicha prorektor": {
        uz: "O'quv ishlari bo'yicha prorektor",
        ru: "Проректор по учебной работе",
        en: "Vice-Rector for Academic Affairs"
    },
    "ilmiy ishlar va innovatsiyalar bo'yicha prorektor": {
        uz: "Ilmiy ishlar va innovatsiyalar bo'yicha prorektor",
        ru: "Проректор по научной работе и инновациям",
        en: "Vice-Rector for Scientific Affairs and Innovations"
    },
    "moliya-iqtisodiyot ishlari bo'yicha prorektor": {
        uz: "Moliya-iqtisodiyot ishlari bo'yicha prorektor",
        ru: "Проректор по финансово-экономическим вопросам",
        en: "Vice-Rector for Financial and Economic Affairs"
    },
    "xalqaro hamkorlik bo'yicha prorektor": {
        uz: "Xalqaro hamkorlik bo'yicha prorektor",
        ru: "Проректор по международному сотрудничеству",
        en: "Vice-Rector for International Cooperation"
    },
    "prorektor": { uz: "Prorektor", ru: "Проректор", en: "Vice-Rector" },

    // Dean's Office / Faculties
    "fakultet dekani": { uz: "Fakultet dekani", ru: "Декан факультета", en: "Dean of Faculty" },
    "dekan": { uz: "Dekan", ru: "Декан", en: "Dean" },
    "o'quv ishlari bo'yicha dekan o'rinbosari": {
        uz: "O'quv ishlari bo'yicha dekan o'rinbosari",
        ru: "Заместитель декана по учебной работе",
        en: "Deputy Dean for Academic Affairs"
    },
    "yoshlar masalalari va ma'naviyat bo'yicha dekan o'rinbosari": {
        uz: "Yoshlar masalalari va ma'naviyat bo'yicha dekan o'rinbosari",
        ru: "Заместитель декана по работе с молодежью",
        en: "Deputy Dean for Youth Affairs"
    },
    "yoshlar bilan ishlash bo'yicha dekan o'rinbosari": {
        uz: "Yoshlar bilan ishlash bo'yicha dekan o'rinbosari",
        ru: "Заместитель декана по работе с молодежью",
        en: "Deputy Dean for Youth Affairs"
    },
    "ilmiy ishlar bo'yicha dekan o'rinbosari": {
        uz: "Ilmiy ishlar bo'yicha dekan o'rinbosari",
        ru: "Заместитель декана по научной работе",
        en: "Deputy Dean for Scientific Affairs"
    },
    "dekan o'rinbosari": { uz: "Dekan o'rinbosari", ru: "Заместитель декана", en: "Deputy Dean" },

    // Academic / Departments
    "kafedra mudiri": { uz: "Kafedra mudiri", ru: "Заведующий кафедрой", en: "Head of Department" },
    "kafedra mudri": { uz: "Kafedra mudiri", ru: "Заведующий кафедрой", en: "Head of Department" },
    "professor": { uz: "Professor", ru: "Профессор", en: "Professor" },
    "dotsent": { uz: "Dotsent", ru: "Доцент", en: "Associate Professor" },
    "katta o'qituvchi": { uz: "Katta o'qituvchi", ru: "Старший преподаватель", en: "Senior Teacher" },
    "katta oqituvchi": { uz: "Katta o'qituvchi", ru: "Старший преподаватель", en: "Senior Teacher" },
    "o'qituvchi": { uz: "O'qituvchi", ru: "Преподаватель", en: "Teacher" },
    "oqituvchi": { uz: "O'qituvchi", ru: "Преподаватель", en: "Teacher" },
    "assistent": { uz: "Assistent", ru: "Ассистент", en: "Assistant" },
    "assistent o'qituvchi": { uz: "Assistent o'qituvchi", ru: "Ассистент-преподаватель", en: "Assistant Teacher" },
    "stajyor-o'qituvchi": { uz: "Stajyor-o'qituvchi", ru: "Преподаватель-стажер", en: "Trainee Teacher" },
    "stajyor o'qituvchi": { uz: "Stajyor-o'qituvchi", ru: "Преподаватель-стажер", en: "Trainee Teacher" },
    "stajor oqituvchi": { uz: "Stajyor-o'qituvchi", ru: "Преподаватель-стажер", en: "Trainee Teacher" },
    "tyutor": { uz: "Tyutor", ru: "Тьютор", en: "Tutor" },

    // Administrative / Centers / Departments
    "bo'lim boshlig'i": { uz: "Bo'lim boshlig'i", ru: "Начальник отдела", en: "Head of Department" },
    "bolim boshligi": { uz: "Bo'lim boshlig'i", ru: "Начальник отдела", en: "Head of Department" },
    "bo'lim mudiri": { uz: "Bo'lim mudiri", ru: "Заведующий отделом", en: "Head of Department" },
    "bolim mudiri": { uz: "Bo'lim mudiri", ru: "Заведующий отделом", en: "Head of Department" },
    "markaz boshlig'i": { uz: "Markaz boshlig'i", ru: "Начальник центра", en: "Head of Center" },
    "markaz mudiri": { uz: "Markaz mudiri", ru: "Заведующий центром", en: "Head of Center" },
    "boshqaruvchi": { uz: "Boshqaruvchi", ru: "Управляющий", en: "Manager" },
    "bosh mutaxassis": { uz: "Bosh mutaxassis", ru: "Главный специалист", en: "Chief Specialist" },
    "yetakchi mutaxassis": { uz: "Yetakchi mutaxassis", ru: "Ведущий специалист", en: "Leading Specialist" },
    "katta mutaxassis": { uz: "Katta mutaxassis", ru: "Старший специалист", en: "Senior Specialist" },
    "mutaxassis": { uz: "Mutaxassis", ru: "Специалист", en: "Specialist" },
    "uslubchi": { uz: "Uslubchi", ru: "Методист", en: "Methodologist" },
    "metodist": { uz: "Metodist", ru: "Методист", en: "Methodologist" },
    "katta laborant": { uz: "Katta laborant", ru: "Старший лаборант", en: "Senior Laboratory Assistant" },
    "laborant": { uz: "Laborant", ru: "Лаборант", en: "Laboratory Assistant" },
    "muhandis-dasturchi": { uz: "Muhandis-dasturchi", ru: "Инженер-программист", en: "Software Engineer" },
    "muhandis": { uz: "Muhandis", ru: "Инженер", en: "Engineer" },
    "dasturchi": { uz: "Dasturchi", ru: "Программист", en: "Programmer" },
    "tizim administratori": { uz: "Tizim administratori", ru: "Системный администратор", en: "System Administrator" },
    "axborot xavfsizligi bo'yicha mutaxassis": {
        uz: "Axborot xavfsizligi bo'yicha mutaxassis",
        ru: "Специалист по информационной безопасности",
        en: "Information Security Specialist"
    },
    "kutubxonachi": { uz: "Kutubxonachi", ru: "Библиотекарь", en: "Librarian" },
    "bosh kutubxonachi": { uz: "Bosh kutubxonachi", ru: "Главный библиотекарь", en: "Head Librarian" },
    "katta ilmiy xodim": { uz: "Katta ilmiy xodim", ru: "Старший научный сотрудник", en: "Senior Researcher" },
    "ilmiy xodim": { uz: "Ilmiy xodim", ru: "Научный сотрудник", en: "Researcher" },
    "kichik ilmiy xodim": { uz: "Kichik ilmiy xodim", ru: "Младший научный сотрудник", en: "Junior Researcher" },
    "bosh hisobchi": { uz: "Bosh hisobchi", ru: "Главный бухгалтер", en: "Chief Accountant" },
    "hisobchi": { uz: "Hisobchi", ru: "Бухгалтер", en: "Accountant" },
    "iqtisodchi": { uz: "Iqtisodchi", ru: "Экономист", en: "Economist" },
    "yuriskonsult": { uz: "Yuriskonsult", ru: "Юрисконсульт", en: "Legal Counsel" },
    "yurist": { uz: "Yurist", ru: "Юрист", en: "Legal Counsel" },
    "matbuot kotibi": { uz: "Matbuot kotibi", ru: "Пресс-секретарь", en: "Press Secretary" },
    "psixolog": { uz: "Psixolog", ru: "Психолог", en: "Psychologist" },
    "komendant": { uz: "Komendant", ru: "Комендант", en: "Commandant" },
    "dispetcher": { uz: "Dispetcher", ru: "Диспетчер", en: "Dispatcher" },
    "kotiba": { uz: "Kotiba", ru: "Секретарь", en: "Secretary" },
    "kotib": { uz: "Kotib", ru: "Секретарь", en: "Secretary" },
    "ish yurituvchi": { uz: "Ish yurituvchi", ru: "Делопроизводитель", en: "Office Clerk" },
    "arxivchi": { uz: "Arxivchi", ru: "Архивариус", en: "Archivist" },
    "kadrlar bo'limi boshlig'i": {
        uz: "Kadrlar bo'limi boshlig'i",
        ru: "Начальник отдела кадров",
        en: "Head of Human Resources Department"
    },
    "inspektor": { uz: "Inspektor", ru: "Инспектор", en: "Inspector" },
    "kadrlar bo'yicha inspektor": { uz: "Kadrlar bo'yicha inspektor", ru: "Инспектор по кадрам", en: "HR Inspector" },
    "shifokor": { uz: "Shifokor", ru: "Врач", en: "Doctor" },
    "hamshira": { uz: "Hamshira", ru: "Медсестра", en: "Nurse" },
    "haydovchi": { uz: "Haydovchi", ru: "Водитель", en: "Driver" },
    "qorovul": { uz: "Qorovul", ru: "Охранник", en: "Security Guard" },
    "farrosh": { uz: "Farrosh", ru: "Уборщик", en: "Cleaner" },
    "bog'bon": { uz: "Bog'bon", ru: "Садовник", en: "Gardener" },
    "santexnik": { uz: "Santexnik", ru: "Сантехник", en: "Plumber" },
    "elektrik": { uz: "Elektrik", ru: "Электрик", en: "Electrician" },
    "usta": { uz: "Usta", ru: "Мастер", en: "Master" },
    "oshpaz": { uz: "Oshpaz", ru: "Повар", en: "Cook" },
};

export const STANDARD_UNIVERSITY_POSITIONS = [
    { uz: "Dekan", ru: "Декан", en: "Dean" },
    { uz: "Katta o'qituvchi", ru: "Старший преподаватель", en: "Senior Teacher" },
    { uz: "Kafedra mudiri", ru: "Заведующий кафедрой", en: "Head of Department" },
    { uz: "Dotsent", ru: "Доцент", en: "Associate Professor" },
    { uz: "Professor", ru: "Профессор", en: "Professor" },
    { uz: "O'qituvchi", ru: "Преподаватель", en: "Teacher" },
    { uz: "Assistent", ru: "Ассистент", en: "Assistant" },
    { uz: "Stajyor-o'qituvchi", ru: "Преподаватель-стажер", en: "Trainee Teacher" },
    { uz: "O'quv ishlari bo'yicha dekan o'rinbosari", ru: "Заместитель декана по учебной работе", en: "Deputy Dean for Academic Affairs" },
    { uz: "Yoshlar masalalari va ma'naviyat bo'yicha dekan o'rinbosari", ru: "Заместитель декана по работе с молодежью", en: "Deputy Dean for Youth Affairs" },
    { uz: "Ilmiy ishlar bo'yicha dekan o'rinbosari", ru: "Заместитель декана по научной работе", en: "Deputy Dean for Scientific Affairs" },
    { uz: "Tyutor", ru: "Тьютор", en: "Tutor" },
    { uz: "Rektor", ru: "Ректор", en: "Rector" },
    { uz: "Birinchi prorektor", ru: "Первый проректор", en: "First Vice-Rector" },
    { uz: "O'quv ishlari bo'yicha prorektor", ru: "Проректор по учебной работе", en: "Vice-Rector for Academic Affairs" },
    { uz: "Ilmiy ishlar va innovatsiyalar bo'yicha prorektor", ru: "Проректор по научной работе и инновациям", en: "Vice-Rector for Scientific Affairs and Innovations" },
    { uz: "Yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor", ru: "Первый проректор по делам молодежи", en: "First Vice-Rector for Youth Affairs" },
    { uz: "Moliya-iqtisodiyot ishlari bo'yicha prorektor", ru: "Проректор по финансово-экономическим вопросам", en: "Vice-Rector for Financial and Economic Affairs" },
    { uz: "Xalqaro hamkorlik bo'yicha prorektor", ru: "Проректор по международному сотрудничеству", en: "Vice-Rector for International Cooperation" },
    { uz: "Bo'lim boshlig'i", ru: "Начальник отдела", en: "Head of Department" },
    { uz: "Bosh mutaxassis", ru: "Главный специалист", en: "Chief Specialist" },
    { uz: "Yetakchi mutaxassis", ru: "Ведущий специалист", en: "Leading Specialist" },
    { uz: "Mutaxassis", ru: "Специалист", en: "Specialist" },
    { uz: "Metodist", ru: "Методист", en: "Methodologist" },
    { uz: "Laborant", ru: "Лаборант", en: "Laboratory Assistant" },
    { uz: "Katta laborant", ru: "Старший лаборант", en: "Senior Laboratory Assistant" },
    { uz: "Muhandis-dasturchi", ru: "Инженер-программист", en: "Software Engineer" },
    { uz: "Kutubxonachi", ru: "Библиотекарь", en: "Librarian" },
    { uz: "Yuriskonsult", ru: "Юрисконсульт", en: "Legal Counsel" },
    { uz: "Bosh hisobchi", ru: "Главный бухгалтер", en: "Chief Accountant" },
    { uz: "Hisobchi", ru: "Бухгалтер", en: "Accountant" },
    { uz: "Komendant", ru: "Комендант", en: "Commandant" },
    { uz: "Psixolog", ru: "Психолог", en: "Psychologist" }
];

export function normalizePositionKey(str) {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/[''`ʼ‘’ʻ]/g, "'")
        .replace(/\s+/g, ' ');
}

export function resolvePositionTranslations(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        return { uz: '', ru: '', en: '' };
    }
    const clean = rawText.trim();
    const key = normalizePositionKey(clean);

    // 1. Direct dictionary match
    if (POSITION_DICTIONARY[key]) {
        return { ...POSITION_DICTIONARY[key] };
    }

    // 2. Reverse lookup by Russian, English or Uzbek name
    for (const entry of Object.values(POSITION_DICTIONARY)) {
        if (
            normalizePositionKey(entry.ru) === key ||
            normalizePositionKey(entry.en) === key ||
            normalizePositionKey(entry.uz) === key
        ) {
            return { ...entry };
        }
    }

    // 3. Keyword heuristic matching
    if (key.includes("dekan")) {
        if (key.includes("o'rinbosar") || key.includes("orinbosar") || key.includes("zamestit") || key.includes("deputy")) {
            if (key.includes("o'quv") || key.includes("uch")) {
                return { uz: "O'quv ishlari bo'yicha dekan o'rinbosari", ru: "Заместитель декана по учебной работе", en: "Deputy Dean for Academic Affairs" };
            }
            if (key.includes("yoshlar") || key.includes("molod")) {
                return { uz: "Yoshlar masalalari va ma'naviyat bo'yicha dekan o'rinbosari", ru: "Заместитель декана по работе с молодежью", en: "Deputy Dean for Youth Affairs" };
            }
            if (key.includes("ilmiy") || key.includes("nauch")) {
                return { uz: "Ilmiy ishlar bo'yicha dekan o'rinbosari", ru: "Заместитель декана по научной работе", en: "Deputy Dean for Scientific Affairs" };
            }
            return { uz: "Dekan o'rinbosari", ru: "Заместитель декана", en: "Deputy Dean" };
        }
        return { uz: "Dekan", ru: "Декан", en: "Dean" };
    }

    if (key.includes("kafedra") && (key.includes("mudir") || key.includes("mudr") || key.includes("zav") || key.includes("head"))) {
        return { uz: "Kafedra mudiri", ru: "Заведующий кафедрой", en: "Head of Department" };
    }

    if (key.includes("katta") && (key.includes("o'qituvchi") || key.includes("oqituvchi") || key.includes("prepodavatel") || key.includes("teacher"))) {
        return { uz: "Katta o'qituvchi", ru: "Старший преподаватель", en: "Senior Teacher" };
    }

    if (key.includes("stajyor") || key.includes("stajor") || key.includes("trainee")) {
        return { uz: "Stajyor-o'qituvchi", ru: "Преподаватель-стажер", en: "Trainee Teacher" };
    }

    if (key.includes("dotsent") || key.includes("docent") || key.includes("associate")) {
        return { uz: "Dotsent", ru: "Доцент", en: "Associate Professor" };
    }

    if (key.includes("professor")) {
        return { uz: "Professor", ru: "Профессор", en: "Professor" };
    }

    if (key.includes("assistent") || key.includes("assistant")) {
        return { uz: "Assistent", ru: "Ассистент", en: "Assistant" };
    }

    if (key.includes("o'qituvchi") || key.includes("oqituvchi") || key.includes("prepodavatel") || key.includes("teacher")) {
        return { uz: "O'qituvchi", ru: "Преподаватель", en: "Teacher" };
    }

    if (key.includes("tyutor") || key.includes("tutor")) {
        return { uz: "Tyutor", ru: "Тьютор", en: "Tutor" };
    }

    if (key.includes("prorektor") || key.includes("pro-rector") || key.includes("vice-rector")) {
        if (key.includes("o'quv")) return { uz: "O'quv ishlari bo'yicha prorektor", ru: "Проректор по учебной работе", en: "Vice-Rector for Academic Affairs" };
        if (key.includes("ilmiy")) return { uz: "Ilmiy ishlar va innovatsiyalar bo'yicha prorektor", ru: "Проректор по научной работе и инновациям", en: "Vice-Rector for Scientific Affairs and Innovations" };
        if (key.includes("yoshlar")) return { uz: "Yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor", ru: "Первый проректор по делам молодежи", en: "First Vice-Rector for Youth Affairs" };
        return { uz: "Prorektor", ru: "Проректор", en: "Vice-Rector" };
    }

    if (key.includes("rektor") || key.includes("rector")) {
        return { uz: "Rektor", ru: "Ректор", en: "Rector" };
    }

    if (key.includes("mutaxassis") || key.includes("specialist")) {
        if (key.includes("bosh") || key.includes("glavn") || key.includes("chief")) {
            return { uz: "Bosh mutaxassis", ru: "Главный специалист", en: "Chief Specialist" };
        }
        if (key.includes("yetakchi") || key.includes("vedush") || key.includes("lead")) {
            return { uz: "Yetakchi mutaxassis", ru: "Ведущий специалист", en: "Leading Specialist" };
        }
        return { uz: "Mutaxassis", ru: "Специалист", en: "Specialist" };
    }

    if (key.includes("laborant")) {
        if (key.includes("katta") || key.includes("starsh") || key.includes("senior")) {
            return { uz: "Katta laborant", ru: "Старший лаборант", en: "Senior Laboratory Assistant" };
        }
        return { uz: "Laborant", ru: "Лаборант", en: "Laboratory Assistant" };
    }

    if (key.includes("uslubchi") || key.includes("metodist")) {
        return { uz: "Metodist", ru: "Методист", en: "Methodologist" };
    }

    if (key.includes("kutubxona") || key.includes("librar") || key.includes("bibliotek")) {
        return { uz: "Kutubxonachi", ru: "Библиотекарь", en: "Librarian" };
    }

    if (key.includes("hisobchi") || key.includes("buhgalter") || key.includes("accountant")) {
        if (key.includes("bosh") || key.includes("chief") || key.includes("glavn")) {
            return { uz: "Bosh hisobchi", ru: "Главный бухгалтер", en: "Chief Accountant" };
        }
        return { uz: "Hisobchi", ru: "Бухгалтер", en: "Accountant" };
    }

    // 4. Fallback: preserve original text across languages
    return {
        uz: clean,
        ru: clean,
        en: clean
    };
}

export function getPositionName(position, lang = 'uz', fallback = "O'qituvchi") {
    if (position == null || position === '') return fallback;
    const targetLang = String(lang || 'uz').slice(0, 2).toLowerCase();
    if (typeof position === 'string') {
        const tr = resolvePositionTranslations(position);
        return tr[targetLang] || tr.uz || position || fallback;
    }
    const val = localizedField(position, 'name', targetLang, '') || localizedField(position, 'title', targetLang, '');
    if (val && typeof val === 'string' && val.trim()) {
        if (targetLang === 'uz') return val;
        // If localizedField returned something, verify if it was just fallback Uzbek
        const baseUz = position.nameUz || position.titleUz || position.name || position.title || '';
        if (val !== baseUz) {
            return val;
        }
    }

    const baseName = position.nameUz || position.titleUz || position.name || position.title || '';
    if (baseName && typeof baseName === 'string') {
        const tr = resolvePositionTranslations(baseName);
        return tr[targetLang] || tr.uz || baseName;
    }

    return fallback;
}

export function resolvePersonPosition(person, lang = 'uz', fallback = "O'qituvchi") {
    if (!person) return fallback;

    if (isFacultyDean(person)) {
        return lang === 'ru' ? "Декан факультета" : lang === 'en' ? "Dean of Faculty" : "Fakultet dekani";
    }
    if (isDepartmentHead(person)) {
        return lang === 'ru' ? "Заведующий кафедрой" : lang === 'en' ? "Head of Department" : "Kafedra mudiri";
    }
    if (isViceDean(person)) {
        return lang === 'ru' ? "Заместитель декана" : lang === 'en' ? "Deputy Dean" : "Dekan o'rinbosari";
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
    if (fromTitle) return getPositionName(fromTitle, lang, fromTitle);

    if (typeof nested === 'string' && nested.trim()) return getPositionName(nested, lang, nested);
    if (typeof person.positionTitleUz === 'string' && person.positionTitleUz.trim()) {
        return getPositionName(person.positionTitleUz, lang, person.positionTitleUz);
    }
    if (typeof person.positionTitle === 'string' && person.positionTitle.trim()) {
        return getPositionName(person.positionTitle, lang, person.positionTitle);
    }
    if (typeof person.positionName === 'string' && person.positionName.trim()) {
        return getPositionName(person.positionName, lang, person.positionName);
    }

    // Check cached map by person id if available
    if (person.id && typeof window !== 'undefined') {
        try {
            const cachedMap = JSON.parse(localStorage.getItem('urspi_teacher_positions_map') || '{}');
            const cached = cachedMap[String(person.id)];
            if (cached && (cached.position || cached.positionTitleUz)) {
                return getPositionName(cached.position || cached.positionTitleUz, lang, cached.position || cached.positionTitleUz);
            }
        } catch (e) {}
    }

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
    if (!person) return false;
    if (person.isDepartmentHead || person.isMudir || person.raw?.isDepartmentHead || person.raw?.isMudir) return true;
    const s = collectPositionTexts(person);
    if (!s || isDeputyRole(s)) return false;
    return /mudir|mudr|мудир|head of (the )?department|department head|chair/i.test(s);
}

export function isFacultyDean(person) {
    if (!person) return false;
    if (person.isDean || person.raw?.isDean) return true;
    const s = collectPositionTexts(person);
    if (!s || isDeputyRole(s)) return false;
    return /dekan|декан|\bdean\b/i.test(s);
}

export function isViceDean(person) {
    if (!person) return false;
    if (person.isViceDean || person.raw?.isViceDean) return true;
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
