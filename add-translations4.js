import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  dashboard: {
    nav: {
      dashboard: { uz: "Dashboard", ru: "Панель", en: "Dashboard" },
      structure: { uz: "Tuzilma", ru: "Структура", en: "Structure" },
      faculties: { uz: "Fakultetlar", ru: "Факультеты", en: "Faculties" },
      departments: { uz: "Kafedralar", ru: "Кафедры", en: "Departments" },
      centers: { uz: "Markaz va Bo'limlar", ru: "Центры и отделы", en: "Centers & Depts" },
      positions: { uz: "Lavozimlar", ru: "Должности", en: "Positions" },
      users: { uz: "Foydalanuvchilar", ru: "Пользователи", en: "Users" },
      teachers: { uz: "O'qituvchilar", ru: "Учителя", en: "Teachers" },
      news: { uz: "Yangiliklar", ru: "Новости", en: "News" },
      announcements: { uz: "E'lonlar", ru: "Объявления", en: "Announcements" },
      about: { uz: "Biz haqimizda", ru: "О нас", en: "About Us" },
      settings: { uz: "Sozlamalar", ru: "Настройки", en: "Settings" }
    },
    general: {
      return: { uz: "Platformaga qaytish", ru: "Вернуться на платформу", en: "Back to Platform" },
      logout: { uz: "Chiqish", ru: "Выйти", en: "Logout" },
      general_stats: { uz: "Umumiy Statistika", ru: "Общая Статистика", en: "General Statistics" },
      faculties_count: { uz: "Fakultetlar soni", ru: "Количество факультетов", en: "Number of faculties" },
      departments_count: { uz: "Kafedralar soni", ru: "Количество кафедр", en: "Number of departments" },
      staff_count: { uz: "Hodimlar soni", ru: "Количество сотрудников", en: "Number of staff" },
      news_count: { uz: "Yangiliklar soni", ru: "Количество новостей", en: "Number of news" },
      announcements_count: { uz: "E'lonlar soni", ru: "Количество объявлений", en: "Number of announcements" }
    }
  }
};

function patchFile(locale) {
  const file = path.join(__dirname, 'src/locales', locale, 'translation.json');
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!current.dashboard) current.dashboard = {};
  
  for (const [section, keys] of Object.entries(data.dashboard)) {
    if (!current.dashboard[section]) current.dashboard[section] = {};
    for (const [key, langs] of Object.entries(keys)) {
      current.dashboard[section][key] = langs[locale];
    }
  }
  
  fs.writeFileSync(file, JSON.stringify(current, null, 2));
}

patchFile('uz');
patchFile('ru');
patchFile('en');
console.log('Translations added successfully.');
