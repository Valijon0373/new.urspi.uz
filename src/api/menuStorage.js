/**
 * Central storage, IndexedDB file manager, and event dispatcher for Site Menus and Pages Hierarchy
 * Synchronizes MenuAdmin.jsx, Navbar.jsx, and Landing Pages (SubCategory, InfoDetail, MenuCategory)
 */

const STORAGE_KEY = 'urspi_dynamic_menus_hierarchy';
const STORAGE_VERSION_KEY = 'urspi_dynamic_menus_version';
const CURRENT_VERSION = 'v3';
const STORAGE_EVENT = 'urspi-menus-updated';

/**
 * Converts Uzbek Latin text with G‘->Ğ, O‘->Ö, Sh->Ş, Ch->Ç
 */
export function toUzbekLatin(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/G['‘’ʼʻ`]/g, 'Ğ')
    .replace(/g['‘’ʼʻ`]/g, 'ğ')
    .replace(/O['‘’ʼʻ`]/g, 'Ö')
    .replace(/o['‘’ʼʻ`]/g, 'ö')
    .replace(/SH|Sh/g, 'Ş')
    .replace(/sh/g, 'ş')
    .replace(/CH|Ch/g, 'Ç')
    .replace(/ch/g, 'ç');
}

const IDB_NAME = 'urspi_menu_files_db';
const IDB_STORE = 'files';

if (typeof window !== 'undefined' && !window.__urspiBlobUrlMap) {
  window.__urspiBlobUrlMap = new Map();
}

/**
 * Generates a valid minimal PDF Blob for built-in demo journal/document links
 */
function createSamplePdfBlob(title = 'UrDPI Ilmiy Nashri') {
  const safeTitle = String(title).replace(/[()\\]/g, '').slice(0, 60);
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 160 >>
stream
BT
/F1 18 Tf
72 750 Td
(Urganch davlat pedagogika instituti - UrSPI) Tj
/F1 14 Tf
0 -35 Td
(${safeTitle}) Tj
/F1 11 Tf
0 -30 Td
(Rasmiy elektron hujjat nusxasi) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000302 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
514
%%EOF`;
  return new Blob([pdfContent], { type: 'application/pdf' });
}

function registerBuiltInSampleFiles() {
  if (typeof window === 'undefined' || !window.__urspiBlobUrlMap) return;
  const sampleFiles = [
    { path: '/files/journal_2025_1.pdf', title: 'UrDPI Axborotnomasi - 2025-yil 1-son' },
    { path: '/files/journal_2025_2.pdf', title: 'UrDPI Axborotnomasi - 2025-yil 2-son' },
    { path: '/files/journal_2024_1.pdf', title: 'UrDPI Axborotnomasi - 2024-yil 1-son' },
    { path: '/files/pedagogik_mahorat_1.pdf', title: 'Pedagogik mahorat - 2025-yil 1-son' },
    { path: '/files/urspi_nizom.pdf', title: 'UrDPI Nizomi (Ustavi)' }
  ];
  sampleFiles.forEach(({ path, title }) => {
    if (!window.__urspiBlobUrlMap.has(path)) {
      const blob = createSamplePdfBlob(title);
      window.__urspiBlobUrlMap.set(path, URL.createObjectURL(blob));
    }
  });
}

function openFilesDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Stores an uploaded File/Blob in IndexedDB and registers its live blob: URL in window.__urspiBlobUrlMap
 */
export async function storeMenuFile(file) {
  if (!file) return null;
  const id = `idb://menu_file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const blobUrl = URL.createObjectURL(file);
  if (typeof window !== 'undefined' && window.__urspiBlobUrlMap) {
    window.__urspiBlobUrlMap.set(id, blobUrl);
  }
  try {
    const db = await openFilesDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put({
        id,
        name: file.name || 'file',
        type: file.type || 'application/octet-stream',
        blob: file,
        createdAt: Date.now()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    // Fallback for small files if IDB is unavailable
    if (file.size < 2 * 1024 * 1024) {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(blobUrl);
        reader.readAsDataURL(file);
      });
    }
  }
  return id;
}

/**
 * Hydrates all stored files from IndexedDB into window.__urspiBlobUrlMap on app startup
 */
export async function initMenuFilesFromIDB() {
  registerBuiltInSampleFiles();
  try {
    const db = await openFilesDB();
    const records = await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    let added = false;
    records.forEach((rec) => {
      if (rec?.id && rec?.blob && !window.__urspiBlobUrlMap.has(rec.id)) {
        window.__urspiBlobUrlMap.set(rec.id, URL.createObjectURL(rec.blob));
        added = true;
      }
    });
    if (added && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: getStoredMenuHierarchy() }));
    }
  } catch (e) {
    // Ignore IDB errors in restricted environments
  }
}

// Initialize sample & IDB files immediately
if (typeof window !== 'undefined') {
  initMenuFilesFromIDB();
}

/**
 * Localization helper for menu items
 */
export function getLocalizedField(item, baseField = 'name', lang = 'uz') {
  if (!item) return '';
  const l = String(lang || 'uz').split('-')[0].toLowerCase();
  if (l === 'ru' && item[`${baseField}Ru`]) return item[`${baseField}Ru`];
  if (l === 'en' && item[`${baseField}En`]) return item[`${baseField}En`];
  const val = item[`${baseField}Uz`] || item[baseField] || '';
  return l === 'uz' ? toUzbekLatin(val) : val;
}

export const INITIAL_MENU_HIERARCHY = [
  {
    id: 1,
    name: 'Institut',
    nameUz: 'Institut',
    nameRu: 'Институт',
    nameEn: 'Institute',
    slug: 'institut',
    sortOrder: 1,
    categories: [
      {
        id: 101,
        menuId: 1,
        name: 'Institut tarixi',
        nameUz: 'Institut tarixi',
        nameRu: 'История института',
        nameEn: 'History of the Institute',
        slug: 'history',
        linkPath: '/infographic',
        contentType: 'LINK',
        sortOrder: 1,
        subCategories: []
      },
      {
        id: 102,
        menuId: 1,
        name: 'Institut nizomi',
        nameUz: 'Institut nizomi',
        nameRu: 'Устав института',
        nameEn: 'Institute Charter',
        slug: 'charter',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 2,
        subCategories: [
          {
            id: 1021,
            categoryId: 102,
            name: 'Institut nizomi va ustavi',
            nameUz: 'Institut nizomi va ustavi',
            nameRu: 'Устав и положения института',
            nameEn: 'Institute Charter and Regulations',
            slug: 'institut-nizomi-ustavi',
            contentType: 'TABLE',
            tableColumns: '["№", "Hujjat nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 10201,
                subCategoryId: 1021,
                title: 'Urganç davlat pedagogika instituti Ustavi (Nizomi)',
                content: 'Oliy ta\'lim, fan va innovatsiyalar vazirligi tomonidan tasdiqlangan Urganç davlat pedagogika instituti rasmiy ustavi.',
                fileLink: '/files/urspi_nizom.pdf',
                fileName: 'UrDPI_Nizomi.pdf',
                sortOrder: 1,
                createdAt: '2026-01-15T10:00:00',
                years: [2026],
                materials: [
                  {
                    id: 102001,
                    infoId: 10201,
                    year: 2026,
                    title: 'UrDPI Ustavi (2026-yil tahriri)',
                    fileLink: '/files/urspi_nizom.pdf'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 103,
        menuId: 1,
        name: 'Rahbariyat',
        nameUz: 'Rahbariyat',
        nameRu: 'Руководство',
        nameEn: 'Leadership',
        slug: 'leadership',
        linkPath: '/leadership',
        contentType: 'LINK',
        sortOrder: 3,
        subCategories: []
      },
      {
        id: 104,
        menuId: 1,
        name: 'Fakultetlar',
        nameUz: 'Fakultetlar',
        nameRu: 'Факультеты',
        nameEn: 'Faculties',
        slug: 'faculties',
        linkPath: '/faculties',
        contentType: 'LINK',
        sortOrder: 4,
        subCategories: []
      },
      {
        id: 105,
        menuId: 1,
        name: 'Kafedralar',
        nameUz: 'Kafedralar',
        nameRu: 'Кафедры',
        nameEn: 'Departments',
        slug: 'departments',
        linkPath: '/departments',
        contentType: 'LINK',
        sortOrder: 5,
        subCategories: []
      },
      {
        id: 106,
        menuId: 1,
        name: 'Markaz va bölimlar',
        nameUz: 'Markaz va bölimlar',
        nameRu: 'Центры и отделы',
        nameEn: 'Centers and Divisions',
        slug: 'centers',
        linkPath: '/centers',
        contentType: 'LINK',
        sortOrder: 6,
        subCategories: []
      },
      {
        id: 107,
        menuId: 1,
        name: "Me'yoriy hujjatlar",
        nameUz: "Me'yoriy hujjatlar",
        nameRu: 'Нормативные документы',
        nameEn: 'Regulatory Documents',
        slug: 'docs',
        linkPath: '/regulatory-documents',
        contentType: 'LINK',
        sortOrder: 7,
        subCategories: []
      }
    ]
  },
  {
    id: 2,
    name: 'Faoliyat',
    nameUz: 'Faoliyat',
    nameRu: 'Деятельность',
    nameEn: 'Activity',
    slug: 'faoliyat',
    sortOrder: 2,
    categories: [
      {
        id: 201,
        menuId: 2,
        name: 'Ilmiy va innovatsion faoliyat',
        nameUz: 'Ilmiy va innovatsion faoliyat',
        nameRu: 'Научная и инновационная деятельность',
        nameEn: 'Scientific and Innovative Activity',
        slug: 'ilmiy-innovatsion',
        sortOrder: 1,
        subCategories: [
          {
            id: 1,
            categoryId: 201,
            name: 'UrDPI ilmiy jurnallari',
            nameUz: 'UrDPI ilmiy jurnallari',
            nameRu: 'Научные журналы УрГПИ',
            nameEn: 'UrSPI Scientific Journals',
            slug: 'urdpi-jurnallar',
            contentType: 'TABLE',
            tableColumns: '["№", "Sahifa nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 1,
                subCategoryId: 1,
                title: 'UrDPI Axborotnomasi',
                content: 'Urganç davlat pedagogika instituti ilmiy-amaliy axborotnomasi. Jurnalda pedagogika, filologiya, aniq va tabiiy fanlar yönalişidagi ilmiy maqolalar çop etiladi.',
                sortOrder: 1,
                createdAt: '2026-02-10T09:30:00',
                years: [2026, 2025, 2024],
                materials: [
                  { id: 1, infoId: 1, year: 2025, title: '2025-yil 1-son', fileLink: '/files/journal_2025_1.pdf', createdAt: '2025-03-15T10:00:00' },
                  { id: 2, infoId: 1, year: 2025, title: '2025-yil 2-son', fileLink: '/files/journal_2025_2.pdf', createdAt: '2025-06-20T10:00:00' },
                  { id: 3, infoId: 1, year: 2024, title: '2024-yil 1-son', fileLink: '/files/journal_2024_1.pdf', createdAt: '2024-05-10T10:00:00' }
                ]
              },
              {
                id: 2,
                subCategoryId: 1,
                title: "Pedagogik mahorat va ta'lim sifatini oşiriş",
                content: "Zamonaviy pedagogik texnologiyalar va ilğor tajribalar ilmiy-uslubiy töplami",
                sortOrder: 2,
                createdAt: '2026-01-20T14:00:00',
                years: [2025],
                materials: [
                  { id: 4, infoId: 2, year: 2025, title: '2025-yil 1-son', fileLink: '/files/pedagogik_mahorat_1.pdf', createdAt: '2025-04-12T10:00:00' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 202,
        menuId: 2,
        name: 'Kengaş',
        nameUz: 'Kengaş',
        nameRu: 'Совет',
        nameEn: 'Council',
        slug: 'kengash',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 2,
        subCategories: [
          {
            id: 2021,
            categoryId: 202,
            name: 'Institut Kengaşi hujjatlari',
            nameUz: 'Institut Kengaşi hujjatlari',
            nameRu: 'Документы Совета института',
            nameEn: 'Institute Council Documents',
            slug: 'kengash-hujjatlari',
            contentType: 'TABLE',
            tableColumns: '["№", "Sahifa nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 20201,
                subCategoryId: 2021,
                title: 'Institut Ilmiy kengaşi iş rejasi va qarorlari',
                content: 'Urganç davlat pedagogika instituti Kengaşining öquv yili uçun tasdiqlangan iş rejasi va yiğiliş bayonnomalari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 203,
        menuId: 2,
        name: 'Moliya bölimi',
        nameUz: 'Moliya bölimi',
        nameRu: 'Финансовый отдел',
        nameEn: 'Finance Department',
        slug: 'finance',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 3,
        subCategories: [
          {
            id: 2031,
            categoryId: 203,
            name: 'Byudjet va moliyaviy oçiqlik',
            nameUz: 'Byudjet va moliyaviy oçiqlik',
            nameRu: 'Бюджет и финансовая прозрачность',
            nameEn: 'Budget and Financial Transparency',
            slug: 'moliyaviy-ochiqlik',
            contentType: 'TABLE',
            tableColumns: '["№", "Hisobot nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 20301,
                subCategoryId: 2031,
                title: 'Davlat xaridlari va smeta ijrosi böyiça hisobotlar',
                content: 'Institutning çoraklik va yillik moliyaviy hisobotlari hamda smeta körsatkiçlari.',
                sortOrder: 1,
                createdAt: '2026-02-05T11:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 204,
        menuId: 2,
        name: "Ma'naviyat",
        nameUz: "Ma'naviyat",
        nameRu: 'Духовность и просвещение',
        nameEn: 'Spirituality',
        slug: 'spirituality',
        linkPath: null,
        contentType: 'FEED',
        sortOrder: 4,
        subCategories: [
          {
            id: 2041,
            categoryId: 204,
            name: "Ma'naviy-ma'rifiy tadbirlar",
            nameUz: "Ma'naviy-ma'rifiy tadbirlar",
            nameRu: 'Духовно-просветительские мероприятия',
            nameEn: 'Spiritual and Educational Events',
            slug: 'manaviy-tadbirlar',
            contentType: 'FEED',
            sortOrder: 1,
            infos: [
              {
                id: 20401,
                subCategoryId: 2041,
                title: 'Beş muhim taşabbus doirasidagi tögaraklar va tadbirlar',
                content: 'Talaba-yoşlarning böş vaqtini mazmunli taşkil etiş maqsadida institutda faoliyat yuritayotgan ijodiy va sport klublari.',
                sortOrder: 1,
                createdAt: '2026-02-12T12:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 205,
        menuId: 2,
        name: 'Institutga işga qabul',
        nameUz: 'Institutga işga qabul',
        nameRu: 'Прием на работу',
        nameEn: 'Recruitment',
        slug: 'recruitment',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 5,
        subCategories: [
          {
            id: 2051,
            categoryId: 205,
            name: 'Böş iş örinlari va tanlov tartibi',
            nameUz: 'Böş iş örinlari va tanlov tartibi',
            nameRu: 'Вакансии и порядок конкурса',
            nameEn: 'Vacancies and Selection Procedure',
            slug: 'vakansiyalar',
            contentType: 'TABLE',
            tableColumns: '["№", "Sahifa nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 20501,
                subCategoryId: 2051,
                title: 'Professor-öqituvçilar va xodimlarni tanlov asosida işga qabul qiliş tartibi',
                content: 'Kafedra va bölimlardagi vakant lavozimlarga hujjat topşiriş şartlari va talablar.',
                sortOrder: 1,
                createdAt: '2026-02-14T09:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Talabalarga',
    nameUz: 'Talabalarga',
    nameRu: 'Студентам',
    nameEn: 'For Students',
    slug: 'talabalarga',
    sortOrder: 3,
    categories: [
      {
        id: 301,
        menuId: 3,
        name: 'Talabalar hayoti',
        nameUz: 'Talabalar hayoti',
        nameRu: 'Студенческая жизнь',
        nameEn: 'Student Life',
        slug: 'student-life',
        linkPath: null,
        contentType: 'FEED',
        sortOrder: 1,
        subCategories: [
          {
            id: 3011,
            categoryId: 301,
            name: 'Talabalar hayoti va yoşlar ittifoqi',
            nameUz: 'Talabalar hayoti va yoşlar ittifoqi',
            nameRu: 'Студенческая жизнь и союз молодежи',
            nameEn: 'Student Life and Youth Union',
            slug: 'talabalar-hayoti',
            contentType: 'FEED',
            sortOrder: 1,
            infos: [
              {
                id: 30101,
                subCategoryId: 3011,
                title: 'Iqtidorli talabalar akademiyasi va klublar faoliyati',
                content: 'UrDPI talabalari uçun taşkil etilgan ilmiy tögaraklar, Zakovat intellektual klubi va volontyorlar harakati.',
                sortOrder: 1,
                createdAt: '2026-02-10T10:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 302,
        menuId: 3,
        name: 'Stipendiyalar',
        nameUz: 'Stipendiyalar',
        nameRu: 'Стипендии',
        nameEn: 'Scholarships',
        slug: 'scholarships',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 2,
        subCategories: [
          {
            id: 3021,
            categoryId: 302,
            name: 'Davlat va nomdor stipendiyalar',
            nameUz: 'Davlat va nomdor stipendiyalar',
            nameRu: 'Государственные и именные стипендии',
            nameEn: 'State and Named Scholarships',
            slug: 'nomdor-stipendiyalar',
            contentType: 'TABLE',
            tableColumns: '["№", "Stipendiya nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 30201,
                subCategoryId: 3021,
                title: 'Özbekiston Respublikasi Prezidenti va nomli davlat stipendiyalari nizomi',
                content: 'Bakalavriat va magistratura talabalari uçun Prezident, Navoiy, Islom Karimov, Bobur va Institut rektori stipendiyalari tanlovi talablari.',
                sortOrder: 1,
                createdAt: '2026-01-25T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 303,
        menuId: 3,
        name: 'Talabalar turar joyi',
        nameUz: 'Talabalar turar joyi',
        nameRu: 'Студенческое общежитие',
        nameEn: 'Student Dormitory',
        slug: 'dormitory',
        linkPath: '/dormitory',
        contentType: 'LINK',
        sortOrder: 3,
        subCategories: []
      },
      {
        id: 304,
        menuId: 3,
        name: 'Kutubxona',
        nameUz: 'Kutubxona',
        nameRu: 'Библиотека',
        nameEn: 'Library',
        slug: 'library',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 4,
        subCategories: [
          {
            id: 3041,
            categoryId: 304,
            name: 'Axborot-resurs markazi (ARM)',
            nameUz: 'Axborot-resurs markazi (ARM)',
            nameRu: 'Информационно-ресурсный центр',
            nameEn: 'Information Resource Center',
            slug: 'axborot-resurs-markazi',
            contentType: 'TABLE',
            tableColumns: '["№", "Resurs nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 30401,
                subCategoryId: 3041,
                title: 'Elektron kutubxona va öquv adabiyotlari bazasi',
                content: 'Institut Axborot-resurs markazidan foydalaniş qoidalari va elektron darsliklar katalogi.',
                sortOrder: 1,
                createdAt: '2026-02-01T09:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Abituriyent',
    nameUz: 'Abituriyent',
    nameRu: 'Абитуриент',
    nameEn: 'Applicants',
    slug: 'abituriyent',
    sortOrder: 4,
    categories: [
      {
        id: 401,
        menuId: 4,
        name: 'Bakalavr',
        nameUz: 'Bakalavr',
        nameRu: 'Бакалавриат',
        nameEn: 'Bachelor',
        slug: 'bachelor',
        linkPath: '/bachelor',
        contentType: 'LINK',
        sortOrder: 1,
        subCategories: []
      },
      {
        id: 402,
        menuId: 4,
        name: 'Magistratura',
        nameUz: 'Magistratura',
        nameRu: 'Магистратура',
        nameEn: 'Master',
        slug: 'master',
        linkPath: '/master',
        contentType: 'LINK',
        sortOrder: 2,
        subCategories: []
      },
      {
        id: 403,
        menuId: 4,
        name: 'Öqişni köçiriş',
        nameUz: 'Öqişni köçiriş',
        nameRu: 'Перевод обучения',
        nameEn: 'Transfer of Studies',
        slug: 'transfer',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 3,
        subCategories: [
          {
            id: 4031,
            categoryId: 403,
            name: 'Öqişni köçiriş va qayta tiklaş',
            nameUz: 'Öqişni köçiriş va qayta tiklaş',
            nameRu: 'Перевод и восстановление обучения',
            nameEn: 'Transfer and Reinstatement of Studies',
            slug: 'oqishni-kochirish-tartibi',
            contentType: 'TABLE',
            tableColumns: '["№", "Ma\'lumot nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 40301,
                subCategoryId: 4031,
                title: 'Xorijiy va respublika OTMlaridan öqişni köçiriş tartibi va ötiş ballari',
                content: 'Talabalar öqişini köçiriş böyiça belgilangan muddatlar, kerakli hujjatlar va minimal ötiş ballari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 404,
        menuId: 4,
        name: 'Ikkinçi mutaxassislik',
        nameUz: 'Ikkinçi mutaxassislik',
        nameRu: 'Второе высшее образование',
        nameEn: 'Second Specialty',
        slug: 'second-specialty',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 4,
        subCategories: [
          {
            id: 4041,
            categoryId: 404,
            name: 'Ikkinçi va undan keyingi oliy ta\'lim',
            nameUz: 'Ikkinçi va undan keyingi oliy ta\'lim',
            nameRu: 'Второе и последующее высшее образование',
            nameEn: 'Second and Subsequent Higher Education',
            slug: 'ikkinchi-mutaxassislik-qabul',
            contentType: 'TABLE',
            tableColumns: '["№", "Yönaliş va ma\'lumotlar", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 40401,
                subCategoryId: 4041,
                title: 'Ikkinçi mutaxassislik ta\'lim yönalişlari va qabul kvotalari',
                content: 'Ikkinçi mutaxassislikka my.edu.uz portali orqali röyxatdan ötiş va suhbat dasturlari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 405,
        menuId: 4,
        name: 'Texnikum bitiruvçilari',
        nameUz: 'Texnikum bitiruvçilari',
        nameRu: 'Выпускники техникумов',
        nameEn: 'Technicum Graduates',
        slug: 'technicum',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 5,
        subCategories: [
          {
            id: 4051,
            categoryId: 405,
            name: 'Texnikum bitiruvçilarini suhbat asosida qabul qiliş',
            nameUz: 'Texnikum bitiruvçilarini suhbat asosida qabul qiliş',
            nameRu: 'Прием выпускников техникумов по собеседованию',
            nameEn: 'Admission of Technicum Graduates by Interview',
            slug: 'texnikum-bitiruvchilari-qabul',
            contentType: 'TABLE',
            tableColumns: '["№", "Sahifa nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 40501,
                subCategoryId: 4051,
                title: 'Texnikumlarni muvaffaqiyatli tamomlagan bitiruvçilarni 2-kursdan öqişga qabul qiliş nizomi',
                content: 'Mos bakalavriat ta\'lim yönalişlari röyxati va suhbat jarayonini baholaş mezonlari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Yaşil institut',
    nameUz: 'Yaşil institut',
    nameRu: 'Зеленый институт',
    nameEn: 'Green Institute',
    slug: 'green-uni',
    linkPath: '/green-institute',
    sortOrder: 5,
    categories: []
  },
  {
    id: 6,
    name: 'Xorijiy talabalar',
    nameUz: 'Xorijiy talabalar',
    nameRu: 'Иностранным студентам',
    nameEn: 'Foreign Students',
    slug: 'xorijiy-talabalar',
    sortOrder: 6,
    categories: [
      {
        id: 601,
        menuId: 6,
        name: 'Xorijiy talabalar uçun',
        nameUz: 'Xorijiy talabalar uçun',
        nameRu: 'Для иностранных студентов',
        nameEn: 'For International Students',
        slug: 'for-foreign',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 1,
        subCategories: [
          {
            id: 6011,
            categoryId: 601,
            name: 'Xorijiy fuqarolarni öqişga qabul qiliş',
            nameUz: 'Xorijiy fuqarolarni öqişga qabul qiliş',
            nameRu: 'Прием иностранных граждан',
            nameEn: 'Admission of Foreign Citizens',
            slug: 'xorijiy-qabul',
            contentType: 'TABLE',
            tableColumns: '["№", "Sahifa nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 60101,
                subCategoryId: 6011,
                title: 'Xorijiy talabalar uçun ta\'lim yönalişlari va kontrakt miqdorlari',
                content: 'Çet el fuqarolarini suhbat asosida UrDPI bakalavriat va magistratura bosqiçlariga qabul qiliş tartibi.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [2026, 2025],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 602,
        menuId: 6,
        name: 'Til kurslari',
        nameUz: 'Til kurslari',
        nameRu: 'Языковые курсы',
        nameEn: 'Language Courses',
        slug: 'lang-courses',
        linkPath: null,
        contentType: 'FEED',
        sortOrder: 2,
        subCategories: [
          {
            id: 6021,
            categoryId: 602,
            name: 'Tayyorlov va til örgatish kurslari',
            nameUz: 'Tayyorlov va til örgatiş kurslari',
            nameRu: 'Подготовительные и языковые курсы',
            nameEn: 'Preparatory and Language Courses',
            slug: 'til-kurslari',
            contentType: 'FEED',
            sortOrder: 1,
            infos: [
              {
                id: 60201,
                subCategoryId: 6021,
                title: 'Xorijiy talabalar uçun özbek, rus va ingliz tili tayyorlov kurslari',
                content: 'Xorijlik tinglovçilar uçun intensiv til örganiş dasturlari va sertifikat kurslari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      },
      {
        id: 603,
        menuId: 6,
        name: 'Viza va hujjatlar',
        nameUz: 'Viza va hujjatlar',
        nameRu: 'Виза и документы',
        nameEn: 'Visa and Documents',
        slug: 'visa',
        linkPath: null,
        contentType: 'TABLE',
        sortOrder: 3,
        subCategories: [
          {
            id: 6031,
            categoryId: 603,
            name: 'Viza va vaqtinçalik röyxatga oliş',
            nameUz: 'Viza va vaqtinçalik röyxatga oliş',
            nameRu: 'Виза и временная регистрация',
            nameEn: 'Visa and Temporary Registration',
            slug: 'viza-tartibi',
            contentType: 'TABLE',
            tableColumns: '["№", "Hujjat nomi", "Köriş"]',
            sortOrder: 1,
            infos: [
              {
                id: 60301,
                subCategoryId: 6031,
                title: 'Talabalik vizasini (A-2) rasmiylaştiriş va uzaytiriş tartibi',
                content: 'Xorijiy talabalar uçun viza taklifnomasi, migratsiya röyxatidan ötiş va tibbiy suğurta talablari.',
                sortOrder: 1,
                createdAt: '2026-02-01T10:00:00',
                years: [],
                materials: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Korrupsiyaga qarşi kuraşiş',
    nameUz: 'Korrupsiyaga qarşi kuraşiş',
    nameRu: 'Противодействие коррупции',
    nameEn: 'Anti-Corruption',
    slug: 'anticorruption',
    linkPath: '/anti-corruption',
    sortOrder: 7,
    categories: []
  },
  {
    id: 8,
    name: 'Statistika',
    nameUz: 'Statistika',
    nameRu: 'Статистика',
    nameEn: 'Statistics',
    slug: 'statistika',
    linkPath: '/infographic',
    sortOrder: 8,
    categories: []
  }
];

/**
 * Merges an older stored hierarchy with v3 defaults so user additions are kept while dead '#' links and Uzbek orthography are upgraded
 */
function upgradeStoredHierarchy(oldHierarchy) {
  if (!Array.isArray(oldHierarchy)) return INITIAL_MENU_HIERARCHY;
  const defaultMap = new Map(INITIAL_MENU_HIERARCHY.map(m => [m.id, m]));
  const result = oldHierarchy.map((menu) => {
    const defMenu = defaultMap.get(menu.id);
    const cleanLink = menu.linkPath === '#' ? (defMenu?.linkPath || null) : menu.linkPath;
    const upgradedCategories = (menu.categories || []).map((cat) => {
      const defCat = defMenu?.categories?.find(dc => dc.id === cat.id);
      const catLink = cat.linkPath === '#' ? (defCat?.linkPath || null) : cat.linkPath;
      const existingSubs = (Array.isArray(cat.subCategories) && cat.subCategories.length > 0
        ? cat.subCategories
        : (defCat?.subCategories || [])
      ).map(sub => ({
        ...sub,
        name: toUzbekLatin(sub.name),
        nameUz: toUzbekLatin(sub.nameUz || sub.name),
        tableColumns: sub.tableColumns ? toUzbekLatin(sub.tableColumns) : sub.tableColumns,
        infos: Array.isArray(sub.infos)
          ? sub.infos.map(info => ({
              ...info,
              title: toUzbekLatin(info.title),
              titleUz: toUzbekLatin(info.titleUz || info.title),
              content: toUzbekLatin(info.content),
              contentUz: toUzbekLatin(info.contentUz || info.content)
            }))
          : []
      }));
      return {
        ...defCat,
        ...cat,
        name: defCat?.name || toUzbekLatin(cat.name),
        nameUz: defCat?.nameUz || toUzbekLatin(cat.nameUz || cat.name),
        linkPath: catLink,
        subCategories: existingSubs
      };
    });
    return {
      ...defMenu,
      ...menu,
      name: defMenu?.name || toUzbekLatin(menu.name),
      nameUz: defMenu?.nameUz || toUzbekLatin(menu.nameUz || menu.name),
      linkPath: cleanLink,
      categories: upgradedCategories
    };
  });
  return result;
}

export function getStoredMenuHierarchy() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (version !== CURRENT_VERSION) {
          const upgraded = upgradeStoredHierarchy(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
          localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
          return upgraded;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored menu hierarchy:', e);
  }
  saveStoredMenuHierarchy(INITIAL_MENU_HIERARCHY);
  return INITIAL_MENU_HIERARCHY;
}

export function saveStoredMenuHierarchy(hierarchy) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hierarchy));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: hierarchy }));
    }
  } catch (e) {
    console.error('Error saving menu hierarchy:', e);
  }
}

export function resetMenuHierarchyToDefault() {
  const clone = JSON.parse(JSON.stringify(INITIAL_MENU_HIERARCHY));
  saveStoredMenuHierarchy(clone);
  return clone;
}

export function onMenuHierarchyChange(callback) {
  const handler = (e) => callback(e?.detail || getStoredMenuHierarchy());
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

// ── CRUD Helpers for Admin and Landing ──
export function getStoredMenus() {
  const hierarchy = getStoredMenuHierarchy();
  return [...hierarchy]
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
    .map(m => ({
      id: m.id,
      name: m.name,
      nameUz: m.nameUz || m.name,
      nameRu: m.nameRu || '',
      nameEn: m.nameEn || '',
      slug: m.slug,
      linkPath: m.linkPath && m.linkPath !== '#' ? m.linkPath : null,
      sortOrder: m.sortOrder || 1,
      categoriesCount: (m.categories || []).length
    }));
}

export function saveStoredMenu(menuData) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  const id = menuData.id ? Number(menuData.id) : Date.now();
  const existingIdx = hierarchy.findIndex(m => Number(m.id) === id);
  const cleanLink = menuData.linkPath && menuData.linkPath.trim() && menuData.linkPath.trim() !== '#'
    ? menuData.linkPath.trim()
    : null;

  if (existingIdx !== -1) {
    hierarchy[existingIdx] = {
      ...hierarchy[existingIdx],
      ...menuData,
      name: menuData.name || menuData.nameUz || hierarchy[existingIdx].name,
      nameUz: menuData.nameUz || menuData.name || hierarchy[existingIdx].nameUz,
      nameRu: menuData.nameRu !== undefined ? menuData.nameRu : hierarchy[existingIdx].nameRu,
      nameEn: menuData.nameEn !== undefined ? menuData.nameEn : hierarchy[existingIdx].nameEn,
      linkPath: cleanLink,
      sortOrder: Number(menuData.sortOrder) || 1,
      id
    };
  } else {
    hierarchy.push({
      id,
      name: menuData.name || menuData.nameUz,
      nameUz: menuData.nameUz || menuData.name,
      nameRu: menuData.nameRu || '',
      nameEn: menuData.nameEn || '',
      slug: menuData.slug,
      linkPath: cleanLink,
      sortOrder: Number(menuData.sortOrder) || hierarchy.length + 1,
      categories: []
    });
  }
  hierarchy.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
  saveStoredMenuHierarchy(hierarchy);
  return { id, ...menuData };
}

export function deleteStoredMenu(menuId) {
  const hierarchy = getStoredMenuHierarchy().filter(m => String(m.id) !== String(menuId));
  saveStoredMenuHierarchy(hierarchy);
}

export function getStoredCategories(menuId) {
  const hierarchy = getStoredMenuHierarchy();
  const categories = [];
  hierarchy.forEach(m => {
    if (!menuId || String(m.id) === String(menuId)) {
      const sortedCats = [...(m.categories || [])].sort(
        (a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
      );
      sortedCats.forEach(c => {
        categories.push({
          ...c,
          menuId: m.id,
          menuName: m.name,
          subCategoriesCount: (c.subCategories || []).length
        });
      });
    }
  });
  return categories;
}

export function saveStoredCategory(catData) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  const targetMenuId = Number(catData.menuId);
  const id = catData.id ? Number(catData.id) : Date.now();
  const cleanLink = catData.linkPath && catData.linkPath.trim() && catData.linkPath.trim() !== '#'
    ? catData.linkPath.trim()
    : null;

  const targetMenu = hierarchy.find(m => Number(m.id) === targetMenuId);
  if (!targetMenu) throw new Error('Menyu topilmadi (ID: ' + targetMenuId + ')');

  // Find if category already exists in ANY menu (in case admin changed its parent menuId)
  let existingCat = null;
  hierarchy.forEach(m => {
    if (Array.isArray(m.categories)) {
      const idx = m.categories.findIndex(c => Number(c.id) === id);
      if (idx !== -1) {
        existingCat = m.categories[idx];
        m.categories.splice(idx, 1);
      }
    }
  });

  targetMenu.categories = targetMenu.categories || [];
  const updatedCat = {
    ...(existingCat || { subCategories: [] }),
    ...catData,
    id,
    menuId: targetMenuId,
    name: catData.name || catData.nameUz || existingCat?.name,
    nameUz: catData.nameUz || catData.name || existingCat?.nameUz,
    nameRu: catData.nameRu !== undefined ? catData.nameRu : (existingCat?.nameRu || ''),
    nameEn: catData.nameEn !== undefined ? catData.nameEn : (existingCat?.nameEn || ''),
    linkPath: cleanLink,
    contentType: cleanLink ? 'LINK' : (catData.contentType || existingCat?.contentType || 'TABLE'),
    sortOrder: Number(catData.sortOrder) || targetMenu.categories.length + 1
  };

  targetMenu.categories.push(updatedCat);
  targetMenu.categories.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));

  saveStoredMenuHierarchy(hierarchy);
  return updatedCat;
}

export function deleteStoredCategory(catId) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  hierarchy.forEach(m => {
    if (m.categories) {
      m.categories = m.categories.filter(c => String(c.id) !== String(catId));
    }
  });
  saveStoredMenuHierarchy(hierarchy);
}

export function getStoredSubCategories(categoryId) {
  const hierarchy = getStoredMenuHierarchy();
  const subCategories = [];
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      if (!categoryId || String(c.id) === String(categoryId)) {
        const sortedSubs = [...(c.subCategories || [])].sort(
          (a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
        );
        sortedSubs.forEach(s => {
          subCategories.push({
            ...s,
            categoryId: c.id,
            categoryName: c.name,
            menuId: m.id,
            menuName: m.name,
            infosCount: (s.infos || []).length
          });
        });
      }
    });
  });
  return subCategories;
}

export function saveStoredSubCategory(subData) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  const targetCatId = Number(subData.categoryId);
  const id = subData.id ? Number(subData.id) : Date.now();

  let targetCategory = null;
  let existingSub = null;

  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      if (Number(c.id) === targetCatId) {
        targetCategory = c;
      }
      if (Array.isArray(c.subCategories)) {
        const idx = c.subCategories.findIndex(s => Number(s.id) === id);
        if (idx !== -1) {
          existingSub = c.subCategories[idx];
          c.subCategories.splice(idx, 1);
        }
      }
    });
  });

  if (!targetCategory) throw new Error('Kategoriya topilmadi (ID: ' + targetCatId + ')');

  targetCategory.subCategories = targetCategory.subCategories || [];
  const updatedSub = {
    ...(existingSub || { infos: [] }),
    ...subData,
    id,
    categoryId: targetCatId,
    name: subData.name || subData.nameUz || existingSub?.name,
    nameUz: subData.nameUz || subData.name || existingSub?.nameUz,
    nameRu: subData.nameRu !== undefined ? subData.nameRu : (existingSub?.nameRu || ''),
    nameEn: subData.nameEn !== undefined ? subData.nameEn : (existingSub?.nameEn || ''),
    contentType: subData.contentType || 'TABLE',
    tableColumns: subData.tableColumns || '["№", "Sahifa nomi", "Ko\'rish"]',
    linkPath: subData.linkPath || null,
    linkTargetType: subData.linkTargetType || 'INTERNAL',
    sortOrder: Number(subData.sortOrder) || targetCategory.subCategories.length + 1
  };

  targetCategory.subCategories.push(updatedSub);
  targetCategory.subCategories.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));

  saveStoredMenuHierarchy(hierarchy);
  return updatedSub;
}

export function deleteStoredSubCategory(subId) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      if (c.subCategories) {
        c.subCategories = c.subCategories.filter(s => String(s.id) !== String(subId));
      }
    });
  });
  saveStoredMenuHierarchy(hierarchy);
}

export function getStoredInfos(subCategoryId) {
  const hierarchy = getStoredMenuHierarchy();
  const infos = [];
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        if (!subCategoryId || String(s.id) === String(subCategoryId)) {
          const sortedInfos = [...(s.infos || [])].sort((a, b) => {
            const orderDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
            if (orderDiff !== 0) return orderDiff;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });
          sortedInfos.forEach(i => {
            infos.push({
              ...i,
              subCategoryId: s.id,
              subCategoryName: s.name,
              categoryId: c.id,
              categoryName: c.name,
              menuId: m.id,
              menuName: m.name,
              materialsCount: (i.materials || []).length
            });
          });
        }
      });
    });
  });
  return infos;
}

export function saveStoredInfo(infoData) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  const targetSubCatId = Number(infoData.subCategoryId);
  const id = infoData.id ? Number(infoData.id) : Date.now();

  let targetSub = null;
  let existingInfo = null;

  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        if (Number(s.id) === targetSubCatId) {
          targetSub = s;
        }
        if (Array.isArray(s.infos)) {
          const idx = s.infos.findIndex(i => Number(i.id) === id);
          if (idx !== -1) {
            existingInfo = s.infos[idx];
            s.infos.splice(idx, 1);
          }
        }
      });
    });
  });

  if (!targetSub) throw new Error('Subkategoriya topilmadi (ID: ' + targetSubCatId + ')');

  targetSub.infos = targetSub.infos || [];
  const updatedInfo = {
    ...(existingInfo || { createdAt: new Date().toISOString(), years: [], materials: [] }),
    ...infoData,
    id,
    subCategoryId: targetSubCatId,
    title: infoData.title || infoData.titleUz || existingInfo?.title,
    titleUz: infoData.titleUz || infoData.title || existingInfo?.titleUz,
    titleRu: infoData.titleRu !== undefined ? infoData.titleRu : (existingInfo?.titleRu || ''),
    titleEn: infoData.titleEn !== undefined ? infoData.titleEn : (existingInfo?.titleEn || ''),
    content: infoData.content !== undefined ? infoData.content : (existingInfo?.content || ''),
    contentUz: infoData.contentUz || infoData.content || existingInfo?.contentUz || '',
    contentRu: infoData.contentRu !== undefined ? infoData.contentRu : (existingInfo?.contentRu || ''),
    contentEn: infoData.contentEn !== undefined ? infoData.contentEn : (existingInfo?.contentEn || ''),
    photoLink: infoData.photoLink !== undefined ? infoData.photoLink : (existingInfo?.photoLink || null),
    fileLink: infoData.fileLink !== undefined ? infoData.fileLink : (existingInfo?.fileLink || null),
    fileName: infoData.fileName !== undefined ? infoData.fileName : (existingInfo?.fileName || null),
    sortOrder: Number(infoData.sortOrder) || 0,
    publishedAt: infoData.publishedAt || existingInfo?.publishedAt || existingInfo?.createdAt || new Date().toISOString()
  };

  targetSub.infos.push(updatedInfo);
  saveStoredMenuHierarchy(hierarchy);
  return updatedInfo;
}

export function deleteStoredInfo(infoId) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        if (s.infos) {
          s.infos = s.infos.filter(i => String(i.id) !== String(infoId));
        }
      });
    });
  });
  saveStoredMenuHierarchy(hierarchy);
}

export function getStoredMaterials(infoId, year) {
  const hierarchy = getStoredMenuHierarchy();
  const materials = [];
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        (s.infos || []).forEach(i => {
          if (!infoId || String(i.id) === String(infoId)) {
            const sortedMats = [...(i.materials || [])].sort(
              (a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)
            );
            sortedMats.forEach(mat => {
              if (!year || String(mat.year) === String(year)) {
                materials.push({
                  ...mat,
                  infoId: i.id,
                  infoTitle: i.title,
                  subCategoryId: s.id,
                  subCategoryName: s.name
                });
              }
            });
          }
        });
      });
    });
  });
  return materials;
}

export function saveStoredMaterial(matData) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  const targetInfoId = Number(matData.infoId);
  const id = matData.id ? Number(matData.id) : Date.now();
  const year = Number(matData.year) || new Date().getFullYear();

  let targetInfo = null;
  let existingMat = null;

  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        (s.infos || []).forEach(i => {
          if (Number(i.id) === targetInfoId) {
            targetInfo = i;
          }
          if (Array.isArray(i.materials)) {
            const idx = i.materials.findIndex(mat => Number(mat.id) === id);
            if (idx !== -1) {
              const oldInfo = i;
              existingMat = oldInfo.materials[idx];
              oldInfo.materials.splice(idx, 1);
              oldInfo.years = Array.from(
                new Set(oldInfo.materials.map(item => Number(item.year)).filter(Boolean))
              ).sort((a, b) => b - a);
            }
          }
        });
      });
    });
  });

  if (!targetInfo) throw new Error('Info topilmadi (ID: ' + targetInfoId + ')');

  targetInfo.materials = targetInfo.materials || [];
  const updatedMat = {
    ...(existingMat || { createdAt: new Date().toISOString() }),
    ...matData,
    id,
    infoId: targetInfoId,
    year,
    title: matData.title || existingMat?.title || `${year} soni`,
    fileLink: matData.fileLink !== undefined ? matData.fileLink : (existingMat?.fileLink || null),
    fileName: matData.fileName !== undefined ? matData.fileName : (existingMat?.fileName || null),
    coverLink: matData.coverLink !== undefined ? matData.coverLink : (existingMat?.coverLink || null)
  };

  targetInfo.materials.push(updatedMat);

  // Recalculate info.years DESC
  const allYears = Array.from(
    new Set(targetInfo.materials.map(m => Number(m.year)).filter(Boolean))
  ).sort((a, b) => b - a);
  targetInfo.years = allYears;

  saveStoredMenuHierarchy(hierarchy);
  return updatedMat;
}

export function deleteStoredMaterial(matId) {
  const hierarchy = JSON.parse(JSON.stringify(getStoredMenuHierarchy()));
  hierarchy.forEach(m => {
    (m.categories || []).forEach(c => {
      (c.subCategories || []).forEach(s => {
        (s.infos || []).forEach(i => {
          if (i.materials) {
            i.materials = i.materials.filter(mat => String(mat.id) !== String(matId));
            i.years = Array.from(
              new Set(i.materials.map(mat => Number(mat.year)).filter(Boolean))
            ).sort((a, b) => b - a);
          }
        });
      });
    });
  });
  saveStoredMenuHierarchy(hierarchy);
}
