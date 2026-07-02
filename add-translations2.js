import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  home: {
    announcements: {
      title: { uz: "E'lonlar", ru: "Объявления", en: "Announcements" },
      view_all: { uz: "Barchasi", ru: "Все", en: "View all" }
    },
    statistics: {
      title: { uz: "Statistika", ru: "Статистика", en: "Statistics" },
      directions: { uz: "Yo'nalishlar", ru: "Направления", en: "Directions" },
      students: { uz: "Talabalar soni", ru: "Количество студентов", en: "Number of students" },
      professors: { uz: "Professor-o'qituvchilar soni", ru: "Количество профессоров-преподавателей", en: "Number of professors-teachers" },
      science_potential: { uz: "Ilmiy salohiyat", ru: "Научный потенциал", en: "Scientific potential" }
    },
    esystems: {
      title: { uz: "Elektron tizimlar", ru: "Электронные системы", en: "Electronic systems" }
    },
    links: {
      title: { uz: "Foydali havolalar", ru: "Полезные ссылки", en: "Useful links" }
    },
    galery: {
      title: { uz: "Fotogalereya", ru: "Фотогалерея", en: "Photo gallery" },
      view_all: { uz: "Barcha rasmlar", ru: "Все фотографии", en: "All photos" }
    }
  }
};

function patchFile(locale) {
  const file = path.join(__dirname, 'src/locales', locale, 'translation.json');
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!current.home) current.home = {};
  
  for (const [section, keys] of Object.entries(data.home)) {
    if (!current.home[section]) current.home[section] = {};
    for (const [key, langs] of Object.entries(keys)) {
      current.home[section][key] = langs[locale];
    }
  }
  
  fs.writeFileSync(file, JSON.stringify(current, null, 2));
}

patchFile('uz');
patchFile('ru');
patchFile('en');
console.log('Translations added successfully.');
