import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  home: {
    carousel: {
      slide1: { uz: "Urganch davlat pedagogika instituti tashkil etildi", ru: "Создан Ургенчский государственный педагогический институт", en: "Urgench State Pedagogical Institute was established" },
      slide2: { uz: "Zamonaviy ta'lim texnologiyalari va innovatsion yondashuv", ru: "Современные образовательные технологии и инновационный подход", en: "Modern educational technologies and innovative approach" },
      details: { uz: "Batafsil", ru: "Подробнее", en: "Details" },
      prev: { uz: "Oldingi rasm", ru: "Предыдущая картина", en: "Previous image" },
      next: { uz: "Keyingi rasm", ru: "Следующая картина", en: "Next image" }
    },
    news: {
      title: { uz: "So'nggi yangiliklar", ru: "Последние новости", en: "Latest news" },
      view_all: { uz: "Barchasi", ru: "Все", en: "View all" },
      label: { uz: "Yangiliklar", ru: "Новости", en: "News" },
      categories: {
        sport: { uz: "Sport", ru: "Спорт", en: "Sport" },
        international: { uz: "Xalqaro hamkorlik", ru: "Международное сотрудничество", en: "International cooperation" },
        olympiads: { uz: "Olimpiadalar", ru: "Олимпиады", en: "Olympiads" },
        events: { uz: "Tadbirlar", ru: "Мероприятия", en: "Events" },
        seminars: { uz: "O'quv seminar", ru: "Учебный семинар", en: "Training seminar" },
        grants: { uz: "Ta'lim granti", ru: "Образовательный грант", en: "Education grant" },
        alumni: { uz: "Bitiruvchilar", ru: "Выпускники", en: "Alumni" }
      }
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
