/**
 * Seed script to push 20 centers and departments to backend API
 * Usage: node seed-centers.js <username> <password>
 */

const BASE_URL = 'https://new.urspi.uz';

const DEFAULT_CENTERS_SEED_DATA = [
  {
    nameUz: "Ta'lim sifatini nazorat qilish bo'limi",
    nameRu: "Отдел контроля качества образования",
    nameEn: "Education Quality Control Department",
    descriptionUz: "Ta'lim jarayoni va ta'lim sifatini muntazam monitoring hamda tahlil qilish bo'limi.",
    descriptionRu: "Отдел регулярного мониторинга и анализа учебного процесса и качества образования.",
    descriptionEn: "Department for regular monitoring and analysis of the educational process and education quality.",
    iconName: "PieChart"
  },
  {
    nameUz: "Ilmiy tadqiqotlar, innovatsiyalar va ilmiy-pedagog kadrlar tayyorlash bo'limi",
    nameRu: "Отдел научных исследований, инноваций и подготовки научно-педагогических кадров",
    nameEn: "Scientific Research, Innovation and Scientific-Pedagogical Staff Training Department",
    descriptionUz: "Ilmiy-tadqiqot loyihalarini muvofiqlashtirish, innovatsion faoliyat va ilmiy kadrlar tayyorlash.",
    descriptionRu: "Координация научно-исследовательских проектов, инновационная деятельность и подготовка научных кадров.",
    descriptionEn: "Coordination of scientific research projects, innovative activities, and training of scientific staff.",
    iconName: "GraduationCap"
  },
  {
    nameUz: "O'quv uslubiy boshqarmasi",
    nameRu: "Учебно-методическое управление",
    nameEn: "Educational and Methodological Department",
    descriptionUz: "Institutdagi o'quv rejalari, dasturlari va ta'lim jarayonini metodik jihatdan muvofiqlashtirish.",
    descriptionRu: "Учебно-методическое сопровождение и координация учебных планов и программ института.",
    descriptionEn: "Educational and methodological support and coordination of institute curricula and programs.",
    iconName: "Library"
  },
  {
    nameUz: "Jismoniy va yuridik shaxslarning murojaatlari bilan ishlash, nazorat va monitoring bo'limi",
    nameRu: "Отдел по работе с обращениями физических и юридических лиц, контроля и мониторинга",
    nameEn: "Department for Appeals of Physical and Legal Entities, Control and Monitoring",
    descriptionUz: "Fuqarolar va yuridik shaxslarning murojaatlarini o'z vaqtida ko'rib chiqish va ijro intizomi monitoringi.",
    descriptionRu: "Своевременное рассмотрение обращений граждан и юридических лиц, мониторинг исполнительской дисциплины.",
    descriptionEn: "Timely review of appeals from citizens and legal entities, monitoring execution discipline.",
    iconName: "Users"
  },
  {
    nameUz: "Magistratura bo'limi",
    nameRu: "Отдел магистратуры",
    nameEn: "Master's Department",
    descriptionUz: "Magistratura mutaxassisliklari bo'yicha ta'lim jarayonini tashkil etish va muvofiqlashtirish.",
    descriptionRu: "Организация и координация учебного процесса по специальностям магистратуры.",
    descriptionEn: "Organization and coordination of the educational process for Master's degree specialties.",
    iconName: "Award"
  },
  {
    nameUz: "Xodimlar bo'limi",
    nameRu: "Отдел кадров",
    nameEn: "Human Resources Department",
    descriptionUz: "Professor-o'qituvchilar va hodimlarning shaxsiy tarkibi hisobini yuritish va mehnat munosabatlari.",
    descriptionRu: "Ведение учета личного состава профессорско-преподавательского состава и сотрудников, трудовые отношения.",
    descriptionEn: "Maintaining personnel records of teaching staff and employees, managing labor relations.",
    iconName: "UserCheck"
  },
  {
    nameUz: "Yoshlar bilan ishlash va ma'naviyat-ma'rifat bo'limi",
    nameRu: "Отдел по работе с молодежью, духовности и просвещения",
    nameEn: "Youth Work, Spirituality and Enlightenment Department",
    descriptionUz: "Talabalarning ma'naviy-ma'rifiy dunyoqarashini shakllantirish hamda yoshlar tashabbuslarini qo'llab-quvvatlash.",
    descriptionRu: "Формирование духовно-просветительского мировоззрения студентов и поддержка молодежных инициатив.",
    descriptionEn: "Developing spiritual and educational outlook of students and supporting youth initiatives.",
    iconName: "Sparkles"
  },
  {
    nameUz: "Iqtidorli talabalar bilan ishlash bo'limi",
    nameRu: "Отдел по работе с одаренными студентами",
    nameEn: "Department for Work with Talented Students",
    descriptionUz: "Iqtidorli talabalarni aniqlash, olimpiada va davlat stipendiyalariga tayyorlash.",
    descriptionRu: "Выявление одаренных студентов, подготовка к олимпиадам и государственным стипендиям.",
    descriptionEn: "Identifying talented students, preparing them for Olympiads and state scholarships.",
    iconName: "Star"
  },
  {
    nameUz: "Yurist konsult bo'limi",
    nameRu: "Юрисконсультский отдел",
    nameEn: "Legal Counsel Department",
    descriptionUz: "Institut faoliyatini huquqiy ta'minlash, shartnomalar va huquqiy hujjatlar ekspertizasi.",
    descriptionRu: "Правовое обеспечение деятельности института, экспертиза договоров и правовых документов.",
    descriptionEn: "Legal support of institute activities, expertise of contracts and legal documents.",
    iconName: "Scale"
  },
  {
    nameUz: "Xalqaro aloqalar bo'limi",
    nameRu: "Отдел международных связей",
    nameEn: "International Relations Department",
    descriptionUz: "Xorijiy oliy ta'lim muassasalari va xalqaro tashkilotlar bilan hamkorlikni yo'lga qo'yish hamda rivojlantirish.",
    descriptionRu: "Установление и развитие сотрудничества с зарубежными высшими учебными заведениями и международными организациями.",
    descriptionEn: "Establishing and developing cooperation with foreign higher education institutions and international organizations.",
    iconName: "Globe"
  },
  {
    nameUz: "Kasaba uyushma qo'mitasi",
    nameRu: "Профсоюзный комитет",
    nameEn: "Trade Union Committee",
    descriptionUz: "Xodimlar va talabalarning mehnat hamda ijtimoiy-iqtisodiy huquq va manfaatlarini himoya qilish.",
    descriptionRu: "Защита трудовых и социально-экономических прав и интересов сотрудников и студентов.",
    descriptionEn: "Protection of labor and socio-economic rights and interests of employees and students.",
    iconName: "Shield"
  },
  {
    nameUz: "Raqamli ta'lim texnologiyalari markazi",
    nameRu: "Центр цифровых образовательных технологий",
    nameEn: "Digital Educational Technologies Center",
    descriptionUz: "Raqamli ta'lim texnologiyalarini joriy etish, elektron ta'lim resurslarini yaratish va ta'lim jarayonini raqamlashtirishni ta'minlash.",
    descriptionRu: "Внедрение цифровых образовательных технологий, создание электронных образовательных ресурсов и цифровизация учебного процесса.",
    descriptionEn: "Implementation of digital educational technologies, creation of e-learning resources and digitalization of the learning process.",
    iconName: "Monitor"
  },
  {
    nameUz: "Buxgalteriya va moliya reja",
    nameRu: "Отдел бухгалтерии и финансового планирования",
    nameEn: "Accounting and Financial Planning Department",
    descriptionUz: "Institut moliya-xo'jalik faoliyati hisobini yuritish va smeta ijrosini rejalashtirish.",
    descriptionRu: "Ведение учета финансово-хозяйственной деятельности института и планирование исполнения сметы.",
    descriptionEn: "Accounting for financial and economic activities of the institute and planning budget execution.",
    iconName: "Calculator"
  },
  {
    nameUz: "Axborot resurs markazi",
    nameRu: "Информационно-ресурсный центр",
    nameEn: "Information Resource Center",
    descriptionUz: "O'quv, ilmiy va badiiy adabiyotlar bazasini shakllantirish hamda kitobxonlarga xizmat ko'rsatish.",
    descriptionRu: "Формирование базы учебной, научной и художественной литературы, обслуживание читателей.",
    descriptionEn: "Forming educational, scientific, and literature database, providing library services to readers.",
    iconName: "FileText"
  },
  {
    nameUz: "Kengash",
    nameRu: "Совет",
    nameEn: "Council",
    descriptionUz: "Institut ilmiy Kengashi majlislarini tashkil etish va Kengash qarorlari ijrosini ta'minlash.",
    descriptionRu: "Организация заседаний Ученого совета института и обеспечение исполнения решений Совета.",
    descriptionEn: "Organization of Scientific Council meetings of the institute and ensuring implementation of Council decisions.",
    iconName: "Landmark"
  },
  {
    nameUz: "Korrupsiya qarshi kurashish \"Komplayens-nazorat\" tizimini boshqarish",
    nameRu: "Отдел управления системой «Комплаенс-контроль» по борьбе с коррупцией",
    nameEn: "Anti-Corruption \"Compliance Control\" System Management Department",
    descriptionUz: "Korrupsiyaviy omillarning oldini olish va komplayens-nazorat tizimini samarali boshqarish.",
    descriptionRu: "Предотвращение коррупционных факторов и эффективное управление системой комплаенс-контроля.",
    descriptionEn: "Preventing corruptive factors and effectively managing compliance control system.",
    iconName: "ShieldCheck"
  },
  {
    nameUz: "Marketing va talabalar amaliyoti \"Karyera markazi\"",
    nameRu: "Центр маркетинга и студенческой практики «Карьера»",
    nameEn: "Marketing and Student Internship \"Career Center\"",
    descriptionUz: "Bitiruvchilarni ish bilan ta'minlash, bandlikka ko'maklashish va talabalar amaliyotini tashkil qilish.",
    descriptionRu: "Содействие в трудоустройстве выпускников и организация студенческой практики.",
    descriptionEn: "Assisting in graduate employment and organizing student internships.",
    iconName: "TrendingUp"
  },
  {
    nameUz: "Xotin-qizlar kengashi",
    nameRu: "Совет женщин",
    nameEn: "Women's Council",
    descriptionUz: "Xotin-qizlar ijtimoiy-siyosiy faolligini oshirish hamda ularning huquq va manfaatlarini qo'llab-quvvatlash.",
    descriptionRu: "Повышение социально-политической активности женщин, поддержка их прав и интересов.",
    descriptionEn: "Increasing socio-political activity of women and supporting their rights and interests.",
    iconName: "Heart"
  },
  {
    nameUz: "Registrator ofisi",
    nameRu: "Офис регистратора",
    nameEn: "Registrar's Office",
    descriptionUz: "Talabalarning akademik ko'rsatkichlari, reytingi hamda o'zlashtirish hujjatlarini tizimli yuritish.",
    descriptionRu: "Систематическое ведение академических показателей, рейтингов и документов успеваемости студентов.",
    descriptionEn: "Systematic maintenance of students' academic performance records, grades, and ratings.",
    iconName: "Briefcase"
  },
  {
    nameUz: "O'qitishning texnik vositalari bo'limi",
    nameRu: "Отдел технических средств обучения",
    nameEn: "Technical Learning Media Department",
    descriptionUz: "Auditoriya va o'quv xonalarini zamonaviy axborot va multimediya texnikalari bilan ta'minlash va ularga xizmat ko'rsatish.",
    descriptionRu: "Оснащение и обслуживание аудиторий современной информационной и мультимедийной техникой.",
    descriptionEn: "Equipping and maintaining classrooms with modern information and multimedia technology.",
    iconName: "Cpu"
  }
];

async function seedCenters() {
  const args = process.argv.slice(2);
  const username = args[0];
  const password = args[1];

  if (!username || !password) {
    console.log('\n❌ Foydalanish: node seed-centers.js <username> <password>');
    console.log('Misol: node seed-centers.js admin supersecret123\n');
    process.exit(1);
  }

  console.log(`\n🔑 Backend API'ga kirilmoqda (${BASE_URL}/api/auth/login)...`);
  
  let token = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(`Login xatosi (${loginRes.status}): ${errText}`);
    }

    const loginData = await loginRes.json();
    token = loginData.accessToken || loginData.token || loginData.jwt || loginData.data?.accessToken;
    if (!token) {
      throw new Error('Token olinmadi: ' + JSON.stringify(loginData));
    }
    console.log('✅ Avtorizatsiyadan muvaffaqiyatli o\'tildi!\n');
  } catch (err) {
    console.error('❌ Login amalga oshmadi:', err.message);
    process.exit(1);
  }

  console.log('🔍 Mavjud markazlar ro\'yxati olinmoqda...');
  let existingNames = new Set();
  try {
    const res = await fetch(`${BASE_URL}/api/landing/centers?page=0&size=100&lang=uz`);
    if (res.ok) {
      const json = await res.json();
      const content = json?.data?.content || json?.content || json?.data || [];
      existingNames = new Set(content.map(c => (c.name || '').toLowerCase().trim()));
    }
  } catch (e) {
    console.warn('⚠️ Mavjud markazlarni olishda ogohlantirish:', e.message);
  }

  console.log(`📦 Barchasi ${DEFAULT_CENTERS_SEED_DATA.length} ta markaz va bo'limlar yuklanmoqda...\n`);

  let added = 0;
  let skipped = 0;

  for (const item of DEFAULT_CENTERS_SEED_DATA) {
    if (existingNames.has(item.nameUz.toLowerCase().trim())) {
      console.log(`⏭️  Mavjud (o'tkazib yuborildi): ${item.nameUz}`);
      skipped++;
      continue;
    }

    const dto = {
      nameUz: item.nameUz,
      nameRu: item.nameRu,
      nameEn: item.nameEn,
      descriptionUz: item.descriptionUz,
      descriptionRu: item.descriptionRu,
      descriptionEn: item.descriptionEn,
      icon: item.iconName,
      iconName: item.iconName
    };

    try {
      const createRes = await fetch(`${BASE_URL}/api/centers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dto)
      });

      if (createRes.ok) {
        console.log(`✅ Qo'shildi: ${item.nameUz}`);
        added++;
      } else {
        const err = await createRes.text();
        console.error(`❌ Xatolik (${item.nameUz}): ${createRes.status} - ${err}`);
      }
    } catch (e) {
      console.error(`❌ Ulanish xatosi (${item.nameUz}): ${e.message}`);
    }
  }

  console.log(`\n🎉 Bajarildi! Qo'shildi: ${added} ta, O'tkazib yuborildi: ${skipped} ta.`);
}

seedCenters();
