import React from 'react';
import {
  BookOpen, GraduationCap, Library, Users, Award, Heart, Sparkles, Star, Scale,
  Globe, Shield, Monitor, Calculator, FileText, Landmark, ShieldCheck,
  TrendingUp, UserCheck, Briefcase, Cpu, Building
} from 'lucide-react';

export const initialCenters = [
  {
    id: 1,
    title: {
      uz: "TA’LIM SIFATINI NAZORAT QILISH BO‘LIMI",
      ru: "Отдел контроля качества образования",
      en: "Education Quality Control Department"
    },
    description: {
      uz: "Ta'lim jarayonining sifatini nazorat qilish, monitoringini olib borish va ta'lim samaradorligini oshirish.",
      ru: "Контроль качества образовательного процесса, мониторинг и повышение эффективности обучения.",
      en: "Monitoring the quality of the educational process and enhancing teaching efficiency."
    },
    iconName: "BookOpen",
    borderColor: "border-t-orange-500",
    iconBg: "bg-orange-50",
    headName: "SOLIEV ANVAR KARIMOVICH",
    phone: "+998 62 224 81 01",
    email: "sifat@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Ta'lim sifati va samaradorligini doimiy monitoring qilish va baholash.",
      "Professor-o'qituvchilar dars berish sifatini va pedagogik maxoratini tahlil qilish.",
      "Talabalar bilimi sifatini va nazorat turlari haqqoniyligini tekshirish.",
      "O'quv jarayonini me'yoriy hujjatlar va davlat ta'lim standartlariga mosligini nazorat qilish.",
      "Ta'lim sifatini oshirish bo'yicha takliflar va tavsiyalar ishlab chiqish.",
      "Bitiruvchilar va ish beruvchilar o'rtasida so'rovnomalar o'tkazish."
    ],
    staff: [
      { id: "sifat_1", name: "Soliev Anvar Karimovch", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 01" },
      { id: "sifat_2", name: "Karimova Shahnoza Erkinovna", position: "Bosh mutaxassis", phone: "+998 90 123 11 22" },
      { id: "sifat_3", name: "Yusupov Sardor Hamidovich", position: "Etakchi mutaxassis", phone: "+998 91 234 33 44" },
      { id: "sifat_4", name: "Rahimov Alisher Boburovich", position: "Monitoring bo'yicha inspektor", phone: "+998 93 345 55 66" }
    ]
  },
  {
    id: 2,
    title: {
      uz: "ILMIY TADQIQOTLAR, INNOVATSIYALAR VA ILMIY-PEDAGOGIK KADRLAR TAYYORLASH BO‘LIMI",
      ru: "Отдел научных исследований, инноваций и подготовки научно-педагогических кадров",
      en: "Department of Scientific Research, Innovations and Pedagogical Staff Training"
    },
    description: {
      uz: "Ilmiy tadqiqotlar, innovatsiyalar va ilmiy-pedagogik kadrlar tayyorlash faoliyatini muvofiqlashtirish va rivojlantirish.",
      ru: "Координация и развитие научных исследований, инноваций и подготовки научно-педагогических кадров.",
      en: "Coordinating and developing research, innovations, and scientific-pedagogical staff training."
    },
    iconName: "GraduationCap",
    borderColor: "border-t-blue-500",
    iconBg: "bg-blue-50",
    headName: "KIM DMITRIY VIKTOROVICH",
    phone: "+998 62 224 81 02",
    email: "ilmiy@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institut ilmiy-tadqiqot ishlarini rejalashtirish va muvofiqlashtirish.",
      "Doktorantura (PhD va DSc) va tayanch doktorantura qabulini tashkil etish.",
      "Grant loyihalari, davlat hamda xalqaro ilmiy dasturlarda ishtirok etishni ta'minlash.",
      "Ilmiy maqolalar, monografiyalar va darsliklar nashr etilishini nazorat qilish.",
      "Ilmiy anjumanlar, simpoziumlar hamda seminarlar tashkil etish.",
      "Yosh olimlar va tadqiqotchilar faoliyatini qo'llab-quvvatlash."
    ],
    staff: [
      { id: "ilmiy_1", name: "Kim Dmitriy Viktorovich", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 02" },
      { id: "ilmiy_2", name: "Matkarimova Nigora Ahmadovna", position: "Bosh mutaxassis (Doktorantura bo'yicha)", phone: "+998 94 567 89 01" },
      { id: "ilmiy_3", name: "Saparov Ilxom Rajabovich", position: "Etakchi mutaxassis (Ilmiy loyihalar)", phone: "+998 97 654 32 10" },
      { id: "ilmiy_4", name: "Sobirov Umidbek Otabekovich", position: "Ilmiy nashrlar bo'yicha muvofiqlashtiruvchi", phone: "+998 99 876 54 32" }
    ]
  },
  {
    id: 3,
    title: {
      uz: "O‘QUV-USLUBIY BOSHQARMA",
      ru: "Учебно-методическое управление",
      en: "Academic and Methodological Department"
    },
    description: {
      uz: "O'quv-uslubiy faoliyatni tashkil etish, o'quv rejalari va dasturlarini muvofiqlashtirish.",
      ru: "Организация учебно-методической деятельности, координация учебных планов и программ.",
      en: "Organization of educational and methodological activities, coordination of curricula and programs."
    },
    iconName: "Library",
    borderColor: "border-t-green-500",
    iconBg: "bg-green-50",
    headName: "RAXIMOV SOBIR JUMAYEVICH",
    phone: "+998 62 224 81 03",
    email: "oquv@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "O'quv rejalari va fan dasturlarini ishlab chiqish hamda tasdiqlash jarayonini boshqarish.",
      "Dars jadvali va imtihon seanslarini muvofiqlashtirish va nazorat qilish.",
      "Kredit-modul tizimida akademik jarayonlarni tashkil etish.",
      "Professor-o'qituvchilar o'quv yuklamalarini taqsimlash va bajarilishini tekshirish.",
      "O'quv-uslubiy majmualar va elektron adabiyotlar sifatini baholash.",
      "Kafedralar va fakultetlarning o'quv faoliyatini tahlil qilish va hisobotlar tayyorlash."
    ],
    staff: [
      { id: "oquv_1", name: "Raximov Sobir Jumayevich", position: "Boshqarma boshlig‘i", phone: "+998 62 224 81 03" },
      { id: "oquv_2", name: "Nurillayev Farrux Mansurovich", position: "O'quv jarayonini rejalashtirish sektori boshlig'i", phone: "+998 90 444 55 66" },
      { id: "oquv_3", name: "Qodirova Malika Alisherovna", position: "O'quv-uslubiy ishlar bo'yicha metodist", phone: "+998 91 333 22 11" },
      { id: "oquv_4", name: "Abdullayev Jasur Rustamovich", position: "Kredit-modul tizimi koordinatori", phone: "+998 93 222 11 00" }
    ]
  },
  {
    id: 4,
    title: {
      uz: "JISMONIY VA YURIDIK SHAXSLARNING MUROJAATLARI BILAN ISHLASH VA NAZORAT BO‘LIMI",
      ru: "Отдел по работе с обращениями физических и юридических лиц и контроля",
      en: "Department for Public Appeals and Control"
    },
    description: {
      uz: "Jismoniy va yuridik shaxslarning murojaatlarini qabul qilish, ko'rib chiqish va ijro nazoratini ta'minlash.",
      ru: "Прием, рассмотрение обращений физических и юридических лиц и обеспечение контроля их исполнения.",
      en: "Receiving, reviewing appeals from individuals and legal entities, and ensuring execution control."
    },
    iconName: "Users",
    borderColor: "border-t-amber-500",
    iconBg: "bg-amber-50",
    headName: "MADAMINOV SHIRINBOY KAZAKOVICH",
    phone: "+998 62 224 81 04",
    email: "murojaat@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Jismoniy va yuridik shaxslarning murojaatlarini qabul qilish, ro'yxatga olish hamda ko'rib chiqish.",
      "Murojaatlarni o'z vaqtida va xolis ko'rib chiqilishini ijro nazoratiga olish.",
      "Institut rahbariyati qabuliga yozilgan fuqarolar qabulini tashkil etish.",
      "Virtual va elektron qabulxonalar orqali kelgan murojaatlar bilan ishlash.",
      "Murojaatlar tahlili bo'yicha davriy hisobotlar hamda statistik ma'lumotlar tayyorlash.",
      "Fuqarolarga murojaatlari yuzasidan huquqiy va tashkiliy tushuntirishlar berish."
    ],
    staff: [
      { id: "murojaat_1", name: "Madaminov Shirinboy Kazakovich", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 04" },
      { id: "murojaat_2", name: "Jumaniyazova Nozima Otabekovna", position: "Bosh mutaxassis", phone: "+998 94 111 22 33" },
      { id: "murojaat_3", name: "Ergashaliyev Murodjon Bobirovich", position: "Murojaatlar inspektori", phone: "+998 97 222 33 44" }
    ]
  },
  {
    id: 5,
    title: {
      uz: "MAGISTRATURA BO‘LIMI",
      ru: "Отдел магистратуры",
      en: "Master's Department"
    },
    description: {
      uz: "Magistraturaga qabul qilish, o'quv jarayonini tashkil etish va ilmiy-tadqiqot ishlarini boshqarish.",
      ru: "Прием в магистратуру, организация учебного процесса и руководство научно-исследовательскими работами.",
      en: "Master's degree admission, educational process organization, and research coordination."
    },
    iconName: "Award",
    borderColor: "border-t-emerald-500",
    iconBg: "bg-emerald-50",
    headName: "ISMAILOV UMRBEK RAVSHANOVICH",
    phone: "+998 62 224 81 05",
    email: "magistratura@urspi.uz",
    receptionHours: "10:00 - 18:00",
    tasks: [
      "Magistratura mutaxassisliklariga qabul jarayonlarini tashkil etish.",
      "Magistrantlarning o'quv va ilmiy-tadqiqot ish rejalari bajarilishini nazorat qilish.",
      "Magistrlik dissertatsiyalari tayyorlanishi va himoyasi jarayonini boshqarish.",
      "Magistrantlar ilmiy rahbarlari faoliyatini muvofiqlashtirish.",
      "Magistrantlar ilmiy maqolalarini nufuzli jurnallarda chop etilishini ta'minlash.",
      "Bitiruvchi magistrlarning mutaxassislik bo'yicha bandligini tahlil qilish."
    ],
    staff: [
      { id: "magistr_1", name: "Ismailov Umrbek Ravshanovich", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 05" },
      { id: "magistr_2", name: "Hasanova Dinora Akmalovna", position: "Magistratura metodisti", phone: "+998 90 999 88 77" },
      { id: "magistr_3", name: "Jabborov Eldor Qahramonovich", position: "Ilmiy-tadqiqot ishlari muvofiqlashtiruvchisi", phone: "+998 91 888 77 66" }
    ]
  },
  {
    id: 6,
    title: {
      uz: "XOTIN-QIZLAR BO‘LIMI",
      ru: "Отдел по работе с женщинами",
      en: "Women's Advisory Department"
    },
    description: {
      uz: "Xotin-qizlar huquq va manfaatlarini himoya qilish, ularning ijtimoiy-siyosiy faolligini oshirish.",
      ru: "Защита прав и интересов женщин, повышение их социально-политической активности.",
      en: "Protecting women's rights and interests, increasing their socio-political activity."
    },
    iconName: "Heart",
    borderColor: "border-t-pink-500",
    iconBg: "bg-pink-50",
    headName: "BOBOXONOVA GULNORA OMANOVNA",
    phone: "+998 62 224 81 06",
    email: "xotinqizlar@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institut talaba-qizlari va xotin-qizlarining huquq hamda manfaatlarini himoya qilish.",
      "Ijtimoiy himoyaga muhtoj, boquvchisini yo'qotgan talaba-qizlarga amaliy yordam ko'rsatish.",
      "Qizlar o'rtasida odob-axloq, kiyinish madaniyati va sog'lom turmush tarzini targ'ib qilish.",
      "Xotin-qizlarning ilmiy va ijodiy faolligini oshirishga qaratilgan tadbirlar o'tkazish.",
      "Qizlar va ayollar psixologik hamda ijtimoiy moslashuviga ko'maklashish.",
      "Turli ko'rik-tanlovlar va to'garaklar tashkil etish."
    ],
    staff: [
      { id: "xotin_1", name: "Boboxonova Gulnora Omanovna", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 06" },
      { id: "xotin_2", name: "Rustamova Zulfiya Davronovna", position: "Talaba-qizlar bilan ishlash bo'yicha mas'ul", phone: "+998 93 777 66 55" },
      { id: "xotin_3", name: "Xo'jamuratova Lola Ergashevna", position: "Ma'naviy-psixologik qo'llab-quvvatlash sektori", phone: "+998 94 666 55 44" }
    ]
  },
  {
    id: 7,
    title: {
      uz: "YOSHLAR BILAN ISHLASH VA MA’NAVIYAT-MA’RIFAT BO‘LIMI",
      ru: "Отдел по работе с молодежью, духовности и просвещения",
      en: "Youth Work and Spirituality-Enlightenment Department"
    },
    description: {
      uz: "Yoshlar bilan ishlash, ularning ma'naviy-ma'rifiy saviyasini va ijtimoiy faolligini oshirish.",
      ru: "Работа с молодежью, повышение их духовно-просветительского уровня и социальной активности.",
      en: "Working with youth, enhancing their spiritual, educational level, and social engagement."
    },
    iconName: "Sparkles",
    borderColor: "border-t-red-500",
    iconBg: "bg-red-50",
    headName: "SULTONOV BEKZOD IKRAMOVICH",
    phone: "+998 62 224 81 07",
    email: "yoshlar@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Talaba-yoshlar o'rtasida ma'naviy-ma'rifiy va tarbiyaviy ishlarni tashkil etish.",
      "Milliy va umuminsoniy qadriyatlar, vatanparvarlik ruhini shakllantirish.",
      "Talabalarning bo'sh vaqtini mazmunli tashkil etish va to'garaklar faoliyatini yuritish.",
      "Bayram tadbirlari, ijodiy uchrashuvlar va ma'rifiy kechalar o'tkazish.",
      "Yoshlar o'rtasida huquqbuzarliklar hamda yot g'oyalar profilaktikasini olib borish.",
      "Talabalar turar joylarida ma'naviy-tarbiyaviy ishlarni muvofiqlashtirish."
    ],
    staff: [
      { id: "yoshlar_1", name: "Sultonov Bekzod Ikramovich", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 07" },
      { id: "yoshlar_2", name: "Matnazarov Azamat Sobirovich", position: "Ma'naviy-ma'rifiy ishlar bo'yicha metodist", phone: "+998 90 555 44 33" },
      { id: "yoshlar_3", name: "Yoqubova Madina Kamolovna", position: "Yoshlar yetakchisi va to'garaklar koordinatori", phone: "+998 91 444 33 22" },
      { id: "yoshlar_4", name: "Yo'ldoshev Alisher Jasurovich", position: "Ma'naviyat sektori mutaxassisi", phone: "+998 93 333 22 11" }
    ]
  },
  {
    id: 8,
    title: {
      uz: "IQTIDORLI TALABALAR BILAN ISHLASH BO‘LIMI",
      ru: "Отдел по работе с одаренными студентами",
      en: "Department for Work with Talented Students"
    },
    description: {
      uz: "Iqtidorli talabalarni aniqlash, ularni ilmiy va ijodiy faoliyatga yo'naltirish.",
      ru: "Выявление одаренных студентов, привлечение их к научной и творческой деятельности.",
      en: "Identifying talented students and directing them towards scientific and creative activities."
    },
    iconName: "Star",
    borderColor: "border-t-yellow-400",
    iconBg: "bg-yellow-50",
    headName: "XUDOYBERGANOVA ZULFIYA",
    phone: "+998 62 224 81 08",
    email: "iqtidorli@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institutdagi iqtidorli talabalarni barvaqt aniqlash hamda bazasini shakllantirish.",
      "Respublikamiz va xalqaro fan olimpiadalari, stipendiyalar hamda tanlovlarga talabalarni tayyorlash.",
      "Nomdor stipendiyalar (Prezident, Navoiy, Ulug'bek va b.) nomzodlarini saralash.",
      "Talabalarni ilmiy-tadqiqot hamda innovatsion loyihalarga jalb etish.",
      "Iqtidorli talabalarning ilmiy maqolalari to'plamlarini nashr etish.",
      "Yetakchi olimlar hamda mutaxassislar bilan mahorat darslarini tashkil qilish."
    ],
    staff: [
      { id: "iqtidor_1", name: "Xudoyberganova Zulfiya", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 08" },
      { id: "iqtidor_2", name: "Karimov Temur Alisherovich", position: "Olimpiadalar va tanlovlar koordinatori", phone: "+998 94 222 11 00" },
      { id: "iqtidor_3", name: "Botirova Nargiza Umidovna", position: "Ilmiy to'garaklar yetakchisi", phone: "+998 97 111 00 99" }
    ]
  },
  {
    id: 9,
    title: {
      uz: "YURIST KONSULT BO‘LIMI",
      ru: "Юридический отдел (Юрисконсульт)",
      en: "Legal Counsel Department"
    },
    description: {
      uz: "Institut faoliyatida huquqiy ustuvorlikni ta'minlash va huquqiy maslahatlar berish.",
      ru: "Обеспечение верховенства закона в деятельности института и оказание юридических консультаций.",
      en: "Ensuring legal compliance in institute operations and providing legal counsel."
    },
    iconName: "Scale",
    borderColor: "border-t-indigo-500",
    iconBg: "bg-indigo-50",
    headName: "JUMANIYAZOV RASHID BAXTIYOROVICH",
    phone: "+998 62 224 81 09",
    email: "yurist@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institut faoliyatida qonunchilik va huquqiy me'yorlar ustuvorligini ta'minlash.",
      "Shartnomalar, buyruqlar va boshqa huquqiy hujjatlar loyihalarini huquqiy ekspertizadan o'tkazish.",
      "Institut va uning xodimlari hamkorligidagi shartnomaviy munosabatlarni qonuniy tartibga solish.",
      "Sud jarayonlarida va davlat organlarida institut manfaatlarini himoya qilish.",
      "Xodimlar hamda talabalarga huquqiy maslahat va tushuntirishlar berish.",
      "Qonunchilikdagi yangiliklar hamda o'zgarishlar bilan institut jamoasini tanishtirib borish."
    ],
    staff: [
      { id: "yurist_1", name: "Jumaniyazov Rashid Baxtiyorovich", position: "Bosh yuristkonsult", phone: "+998 62 224 81 09" },
      { id: "yurist_2", name: "Yoqubov Doniyor Sanjarovich", position: "Huquqiy masalalar bo'yicha yurist", phone: "+998 90 888 99 00" }
    ]
  },
  {
    id: 10,
    title: {
      uz: "XALQARO ALOQALAR BO‘LIMI",
      ru: "Отдел международных связей",
      en: "International Relations Department"
    },
    description: {
      uz: "Xorijiy universitetlar va xalqaro tashkilotlar bilan hamkorlik aloqalarini o'rnatish va rivojlantirish.",
      ru: "Установление и развитие сотрудничества с зарубежными университетами и международными организациями.",
      en: "Establishing and developing partnerships with foreign universities and international organizations."
    },
    iconName: "Globe",
    borderColor: "border-t-cyan-500",
    iconBg: "bg-cyan-50",
    headName: "NURMETOV MASHXUR",
    phone: "+998 62 224 81 10",
    email: "international@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Xorijiy universitetlar va ilmiy markazlar bilan hamkorlik shartnomalarini tuzish.",
      "Akademik mobillik dasturlari (Erasmus+, Orxun va b.) bo'yicha talabalar va o'qituvchilar almashinuvini tashkil etish.",
      "Xorijiy talabalarni institutga o'qishga qabul qilish va ularning vizasini rasmiylashtirish.",
      "Xalqaro grantlar va loyihalarda institut ishtirokini ta'minlash.",
      "Xorijiy professor-o'qituvchilarni o'quv jarayoniga jalb qilish.",
      "Xalqaro reytinglarda (QS, THE) institut o'rnini oshirish bo'yicha ishlarni olib borish."
    ],
    staff: [
      { id: "xalqaro_1", name: "Nurmetov Mashxur", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 10" },
      { id: "xalqaro_2", name: "Karimova Nigora Alisherovna", position: "Xalqaro loyihalar koordinatori", phone: "+998 91 777 88 99" },
      { id: "xalqaro_3", name: "Smirnov Aleksandr Igorevich", position: "Xorijiy talabalar va akademik mobillik bo'yicha mutaxassis", phone: "+998 93 666 77 88" }
    ]
  },
  {
    id: 11,
    title: {
      uz: "KASABA UYUSHMA QO‘MITASI",
      ru: "Профсоюзный комитет",
      en: "Trade Union Committee"
    },
    description: {
      uz: "Xodimlar va talabalarning mehnat hamda ijtimoiy-iqtisodiy huquq va manfaatlarini himoya qilish.",
      ru: "Защита трудовых и социально-экономических прав и интересов сотрудников и студентов.",
      en: "Protecting labor and socio-economic rights and interests of employees and students."
    },
    iconName: "Shield",
    borderColor: "border-t-rose-500",
    iconBg: "bg-rose-50",
    headName: "ALLABERGANOVA MANZURA",
    phone: "+998 62 224 81 11",
    email: "kasaba@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Xodimlar hamda talabalarning mehnat, ijtimoiy-iqtisodiy huquq va manfaatlarini himoya qilish.",
      "Jamoa shartnomasi bajarilishini nazorat qilish hamda mehnat muhofazasini ta'minlash.",
      "Xodimlar va ularning oila a'zolarini sanatoriylarga, dam olish maskanlariga yo'llanmalar bilan ta'minlash.",
      "Ijtimoiy yordamga muhtoj xodimlarga moddiy ko'mak ajratish.",
      "Sport va madaniy-ma'rifiy tadbirlar, ekskursiyalarni tashkil etish.",
      "Mehnat nizolarini xolisona ko'rib chiqishda ishtirok etish."
    ],
    staff: [
      { id: "kasaba_1", name: "Allaberganova Manzura", position: "Qo'mita raisi", phone: "+998 62 224 81 11" },
      { id: "kasaba_2", name: "Baltabayev Rustam Baxtiyorovich", position: "Ijtimoiy himoya bo'yicha mas'ul", phone: "+998 94 444 33 22" },
      { id: "kasaba_3", name: "Yo'ldosheva Umida Davronovna", position: "Madaniy-ma'rifiy ishlar bo'yicha mas'ul", phone: "+998 97 333 22 11" }
    ]
  },
  {
    id: 12,
    title: {
      uz: "RAQAMLI TA’LIM TEXNOLOGIYALARI MARKAZI",
      ru: "Центр цифровых образовательных технологий",
      en: "Digital Educational Technologies Center"
    },
    description: {
      uz: "Institut raqamli infratuzilmasi, IT tizimlari va axborot xavfsizligini boshqarish.",
      ru: "Управление цифровой инфраструктурой, IT-системами и информационной безопасностью института.",
      en: "Managing digital infrastructure, IT systems, and information security of the institute."
    },
    iconName: "Monitor",
    borderColor: "border-t-blue-600",
    iconBg: "bg-blue-50",
    headName: "MATSAPAYEV ODILBEK BAXTIYOR O'G'LI",
    phone: "+998 62 224 81 12",
    email: "rttm@urspi.uz",
    receptionHours: "09:00 - 18:00",
    tasks: [
      "Institutdagi barcha axborot tizimlari va lokal tarmoqlarni samarali boshqarish.",
      "O'quv jarayonida zamonaviy texnologiyalarni keng qo'llash va HEMIS/elektron ta'lim tizimini rivojlantirish.",
      "Talabalar, professor-o'qituvchilar va xodimlarga IT bo'yicha texnik yordam ko'rsatish.",
      "Rasmiy veb-sayt (urspi.uz), portal hamda ichki tizimlarni qo'llab-quvvatlash va yangilab borish.",
      "Axborot xavfsizligini ta'minlash va ma'lumotlar zaxirasini shakllantirish.",
      "Innovatsion IT loyihalarni ishlab chiqish hamda tatbiq etish."
    ],
    staff: [
      { id: "rttm_1", name: "Matsapayev Odilbek Baxtiyor o'g'li", position: "Markaz boshlig'i", phone: "+998 62 224 81 12" },
      { id: "davlatmuratov", name: "Davlatmuratov Valijon To'lqin o'g'li", position: "Muxandis dasturchi 1-toifa", phone: "+998 94 237 03 73" },
      { id: "matyaqubov", name: "Matyaqubov Odilbek O‘ktamovich", position: "Muhandis-dasturchi 1-toifali", phone: "+998 97 606 14 21" },
      { id: "bobojonov", name: "Bobojonov Ahmad Anvar o'g'li", position: "Tarmoq administratori", phone: "+998 93 745 06 15" },
      { id: "jumaniyozov", name: "Jumaniyozov Jahongir Polvonovich", position: "Kontent menejer", phone: "+998 99 745 91 20" },
      { id: "baltabayev", name: "Baltabayev Doniyor Marat o'g'li", position: "Bo‘lim boshlig‘i", phone: "+998 99 022 81 28" },
      { id: "abdullayev", name: "Abdullayev Otajon Otabek o'g'li", position: "Tarmoq administratori", phone: "+998 88 357 95 65" },
      { id: "otaboyev", name: "Otaboyev Akbar Ilxambek o'g'li", position: "Muxandis dasturchi 1-toifa", phone: "+998 97 221 88 96" }
    ]
  },
  {
    id: 13,
    title: {
      uz: "BUXGALTERIYA VA MOLIYA BO‘LIMI",
      ru: "Отдел бухгалтерии и финансов",
      en: "Accounting and Finance Department"
    },
    description: {
      uz: "Institut moliyaviy-xo'jalik faoliyatini, buxgalteriya hisobini va moliyaviy rejalashtirishni olib borish.",
      ru: "Ведение финансово-хозяйственной деятельности, бухгалтерского учета и финансового планирования института.",
      en: "Managing financial and economic activities, accounting, and financial planning of the institute."
    },
    iconName: "Calculator",
    borderColor: "border-t-emerald-600",
    iconBg: "bg-emerald-50",
    headName: "OTAJONOV BAXTIYOR",
    phone: "+998 62 224 81 13",
    email: "buxgalteriya@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institutning barcha moliyaviy-xo'jalik faoliyati buxgalteriya hisobini yuritish.",
      "Ish haqi, stipendiyalar, nafaqalar va boshqa to'lovlarni o'z vaqtida hisoblash hamda to'lash.",
      "Talabalarning kontrakt to'lovlari hisobini yuritish hamda monitoring qilish.",
      "Xarajatlar smetasi va moliyaviy rejalarni tuzish, ularning ijrosini ta'minlash.",
      "Davlat soliq, pensiya va boshqa majburiy ajratmalarni o'z vaqtida o'tkazish.",
      "Moliyaviy va buxgalteriya hisobotlarini vakolatli organlarga taqdim etish."
    ],
    staff: [
      { id: "bux_1", name: "Otajonov Baxtiyor", position: "Bosh buxgalter", phone: "+998 62 224 81 13" },
      { id: "bux_2", name: "Jabborova Malika Qodirovna", position: "Bosh buxgalter o'rinbosari", phone: "+998 90 111 22 33" },
      { id: "bux_3", name: "Quryazov Dilshod Sobirovich", position: "Ish haqi bo'yicha buxgalter", phone: "+998 91 222 33 44" },
      { id: "bux_4", name: "Yoqubova Feruza Rustamovna", position: "Talabalar kontrakt hisobi buxgalteri", phone: "+998 93 333 44 55" }
    ]
  },
  {
    id: 14,
    title: {
      uz: "AXBOROT RESURS MARKAZI",
      ru: "Информационно-ресурсный центр",
      en: "Information Resource Center"
    },
    description: {
      uz: "Zamonaviy axborot-kutubxona resurslari va elektron kitoblar bazasi bilan ta'minlash.",
      ru: "Обеспечение современными информационно-библиотечными ресурсами и базой электронных книг.",
      en: "Providing modern information and library resources and electronic book databases."
    },
    iconName: "FileText",
    borderColor: "border-t-violet-500",
    iconBg: "bg-violet-50",
    headName: "RO'ZIMETOVA DILFUZA",
    phone: "+998 62 224 81 14",
    email: "arm@urspi.uz",
    receptionHours: "09:00 - 18:00",
    tasks: [
      "O'quv, ilmiy, badiiy va elektron adabiyotlar fondini shakllantirish hamda boyitish.",
      "Kitobxonlar (talabalar va o'qituvchilar)ga tezkor va sifatli axborot-kutubxona xizmati ko'rsatish.",
      "Elektron kutubxona va elektron darsliklar bazasini yuritish hamda rivojlantirish.",
      "ARMAT va QR-code tizimlari orqali kitoblarni raqamlashtirish.",
      "Xalqaro va milliy ilmiy ma'lumotlar bazalariga (Scopus, ScienceDirect va b.) kirishni ta'minlash.",
      "Kitobxonlikni targ'ib qiluvchi ko'rgazmalar va adabiy kechalar o'tkazish."
    ],
    staff: [
      { id: "arm_1", name: "Ro'zimetova Dilfuza", position: "ARM direktori", phone: "+998 62 224 81 14" },
      { id: "arm_2", name: "Quryazova Sayyora Alimovna", position: "Axborot-kutubxona resurslarini jamlash sektori", phone: "+998 94 888 77 66" },
      { id: "arm_3", name: "Karimova Umida Boboyevna", position: "Elektron kutubxona va IT sektori", phone: "+998 97 777 66 55" },
      { id: "arm_4", name: "Xo'janiyazova Gulandom", position: "Kitobxonlarga xizmat ko'rsatish bo'limi", phone: "+998 99 666 55 44" }
    ]
  },
  {
    id: 15,
    title: {
      uz: "KENGASH",
      ru: "Совет института",
      en: "Institute Council"
    },
    description: {
      uz: "Institut ilmiy-pedagogik faoliyatining muhim masalalarini ko'rib chiquvchi va qarorlar qabul qiluvchi organ.",
      ru: "Орган, рассматривающий ключевые вопросы научно-педагогической деятельности института и принимающий решения.",
      en: "The body reviewing key scientific and pedagogical issues of the institute and making decisions."
    },
    iconName: "Landmark",
    borderColor: "border-t-purple-600",
    iconBg: "bg-purple-50",
    headName: "KENGASH KOTIBI",
    phone: "+998 62 224 81 15",
    email: "kengash@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institut strategik rivojlanish rejasi va o'quv-ilmiy faoliyatining muhim masalalarini ko'rib chiqish.",
      "Professor-o'qituvchilarga ilmiy unvonlar (dotsent, professor) berish masalalarini muhokama qilish hamda tavsiya etish.",
      "O'quv rejalari, ilmiy-tadqiqot va ma'naviy-tarbiyaviy ishlar hisobotlarini tasdiqlash.",
      "Fakultetlar, kafedralar hamda bo'limlar faoliyati natijalarini baholash.",
      "Tanlov va konkurslar o'tkazish va kadrlarni lavozimlarga tasdiqlash.",
      "Institut Kengashi qarorlari ijrosini nazorat qilish."
    ],
    staff: [
      { id: "kengash_1", name: "Institut Rektori", position: "Kengash raisi", phone: "+998 62 224 81 00" },
      { id: "kengash_2", name: "Bosh ilmiy kotib", position: "Kengash kotibi", phone: "+998 62 224 81 15" },
      { id: "kengash_3", name: "Prorektorlar va dekanlar", position: "Kengash a'zolari", phone: "+998 62 224 81 00" }
    ]
  },
  {
    id: 16,
    title: {
      uz: "KORRUPSIYAGA QARSHI KURASHISH “KOMPLAYENS-NAZORAT” TIZIMINI BOSHGARISH BO‘LIMI",
      ru: "Отдел управления системой «Комплаенс-контроль» по борьбе с коррупцией",
      en: "Anti-Corruption Compliance Control System Department"
    },
    description: {
      uz: "Institutda korrupsiyaga qarshi kurashish, halollik standartlarini va komplayens nazoratni joriy etish.",
      ru: "Внедрение стандартов честности, противодействие коррупции и комплаенс-контроль в институте.",
      en: "Anti-corruption measures, integrity standards implementation, and compliance control in the institute."
    },
    iconName: "ShieldCheck",
    borderColor: "border-t-teal-600",
    iconBg: "bg-teal-50",
    headName: "MATYAKUBOV JUMABOY",
    phone: "+998 62 224 81 16",
    email: "compliance@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institutda korrupsiyaviy xavf-xatarlarni aniqlash, baholash hamda ularni bartaraf etish.",
      "\"Korrupsiyasiz soha\" loyihasini amalga oshirish va halollik standartlarini joriy etish.",
      "Imtihonlar, qabul jarayonlari hamda moliyaviy operatsiyalarda ochiqlikni ta'minlash.",
      "Korrupsiyaga qarshi profilaktik suhbatlar hamda tushuntirish ishlarini olib borish.",
      "Korrupsiya holatlari bo'yicha kelib tushgan murojaatlar va anonim xabarlarni o'rganish.",
      "Manfaatlar toqnashuvining oldini olish bo'yicha choralarni ko'rish."
    ],
    staff: [
      { id: "comp_1", name: "Matyakubov Jumaboy", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 16" },
      { id: "comp_2", name: "Rajabov Alisher Sobirovich", position: "Bosh mutaxassis", phone: "+998 90 222 33 44" },
      { id: "comp_3", name: "Iskandarov Jasur Odilbekovich", position: "Inspektsiya va nazorat mutaxassisi", phone: "+998 91 333 44 55" }
    ]
  },
  {
    id: 17,
    title: {
      uz: "MARKETING VA TALABALAR AMALIYOTI MARKAZI",
      ru: "Центр маркетинга и студенческой практики",
      en: "Marketing and Student Practice Center"
    },
    description: {
      uz: "Bitiruvchilarni ishga joylashtirish, mehnat bozori tahlili va talabalar amaliyotini tashkil etish.",
      ru: "Трудоустройство выпускников, анализ рынка труда и организация практики студентов.",
      en: "Graduate employment support, labor market analysis, and student internship management."
    },
    iconName: "TrendingUp",
    borderColor: "border-t-sky-500",
    iconBg: "bg-sky-50",
    headName: "QURYAZOV ZARIPBOY",
    phone: "+998 62 224 81 17",
    email: "marketing@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Mehnat bozori talablarini o'rganish hamda kadrlar tayyorlash marketingini olib borish.",
      "Bitiruvchilarning ishga joylashishi va bandligi monitoringini yuritish.",
      "Talabalarning o'quv, ishlab chiqarish hamda pedagogik amaliyotlarini tashkil etish.",
      "Ish beruvchi korxona va tashkilotlar bilan hamkorlik shartnomalarini tuzish.",
      "\"Bo'sh ish o'rinlari\" va \"Karera kunlari\" mehnat yarmarkalarini o'tkazish.",
      "Mutaxassislarga bo'lgan talab proqnozlarini ishlab chiqish."
    ],
    staff: [
      { id: "mark_1", name: "Quryazov Zaripboy", position: "Markaz boshlig'i", phone: "+998 62 224 81 17" },
      { id: "mark_2", name: "Davletov Mansur Alisherovich", position: "Bitiruvchilar bandligi sektori", phone: "+998 93 444 55 66" },
      { id: "mark_3", name: "Olimova Shahlo Bobomuratovna", position: "Amaliyot va korporativ hamkorlik mutaxassisi", phone: "+998 97 555 66 77" }
    ]
  },
  {
    id: 18,
    title: {
      uz: "XOTIN-QIZLAR KENGASHI",
      ru: "Совет женщин",
      en: "Women's Council"
    },
    description: {
      uz: "Jamoada xotin-qizlar o'rnini mustahkamlash va ma'naviy-ijtimoiy qo'llab-quvvatlash.",
      ru: "Укрепление роли женщин в коллективе и поддержка их духовно-социальной активности.",
      en: "Strengthening the role of women in the community and providing spiritual and social support."
    },
    iconName: "UserCheck",
    borderColor: "border-t-rose-400",
    iconBg: "bg-rose-50",
    headName: "KENGASH RAISI",
    phone: "+998 62 224 81 18",
    email: "xkengash@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Institut jamoasidagi xotin-qizlar hamda talaba-qizlar ma'naviy-ijtimoiy faolligini oshirish.",
      "Oila va xotin-qizlarni qo'llab-quvvatlash, ularning ijtimoiy muhofazasini ta'minlash.",
      "Qizlar o'rtasida milliy qadriyatlar va oilaviy hayotga tayyorlash mashg'ulotlarini o'tkazish.",
      "Zulfiya nomidagi davlat mukofoti va boshqa tanlovlarga iqtidorli qizlarni tayyorlash.",
      "Salomatlik, gigiyena va ma'rifiy tadbirlarni tashkil etish.",
      "Ijtimoiy ko'makka muhtoj talaba-qizlar holidan xabar olish."
    ],
    staff: [
      { id: "xkengash_1", name: "Xotin-qizlar masalalari bo'yicha maslahatchi", position: "Kengash raisi", phone: "+998 62 224 81 18" },
      { id: "xkengash_2", name: "Fakultetlar xotin-qizlar yetakchilari", position: "Kengash a'zolari", phone: "+998 90 666 77 88" }
    ]
  },
  {
    id: 19,
    title: {
      uz: "REGISTRATOR OFISI",
      ru: "Офис регистратора",
      en: "Office of the Registrar"
    },
    description: {
      uz: "Talabalar o'zlashtirishini ro'yxatga olish, kredit-modul tizimida akademik jarayonlarni yuritish.",
      ru: "Регистрация успеваемости студентов, ведение академических процессов в кредитно-модульной системе.",
      en: "Registering student academic progress and managing academic processes in credit-module system."
    },
    iconName: "Briefcase",
    borderColor: "border-t-slate-600",
    iconBg: "bg-slate-100",
    headName: "BOBOJONOV ALISHER",
    phone: "+998 62 224 81 19",
    email: "registrator@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "Talabalarning akademik tarixini (transkript), baholari va kreditlarini ro'yxatga olish.",
      "Fanlarga va o'qituvchilarga talabalarni onlayn ro'yxatga olish (registration) jarayonini boshqarish.",
      "Akademik qarzdorlik va reyting ko'rsatkichlarini hisoblash hamda qayd etish.",
      "Talabalar harakati (ko'chirish, tiklash, akademik ta'til) bo'yicha hujjatlarni yuritish.",
      "Akademik ma'lumotnomalar hamda diplom ilovalari tayyorlanishini ta'minlash.",
      "Kredit-modul tizimi qoidalariga rioya etilishini nazorat qilish."
    ],
    staff: [
      { id: "reg_1", name: "Bobojonov Alisher", position: "Ofis boshlig'i", phone: "+998 62 224 81 19" },
      { id: "reg_2", name: "Matrasulova Feruza Saburovnа", position: "Akademik transkriptlar va hujjatlar sektori", phone: "+998 91 888 99 00" },
      { id: "reg_3", name: "Sapaev Sherzod Rustamovich", position: "Kredit-modul tizimida akademik ro'yxatga olish mutaxassisi", phone: "+998 93 999 00 11" }
    ]
  },
  {
    id: 20,
    title: {
      uz: "O‘QITISHNING TEXNIK VOSITALARI BO‘LIMI",
      ru: "Отдел технических средств обучения",
      en: "Technical Educational Equipment Department"
    },
    description: {
      uz: "O'quv xonalari va auditoriyalarni texnik, multimediya va interaktiv vositalar bilan ta'minlash hamda ularga xizmat ko'rsatish.",
      ru: "Оснащение и обслуживание аудиторий техническими, мультимедийными и интерактивными средствами обучения.",
      en: "Equipping and maintaining classrooms with technical, multimedia, and interactive learning tools."
    },
    iconName: "Cpu",
    borderColor: "border-t-indigo-600",
    iconBg: "bg-indigo-50",
    headName: "XODJAYEV SHERZOD",
    phone: "+998 62 224 81 20",
    email: "otvb@urspi.uz",
    receptionHours: "09:00 - 17:00",
    tasks: [
      "O'quv auditoriyalari, kompyuter xonalari va zallarni zamonaviy texnik vositalar bilan jihozlash.",
      "Proyektorlar, interaktiv doskalar, kompyuterlar hamda lingafon uskunalariga texnik xizmat ko'rsatish.",
      "Onlayn ma'ruzalar, vebinarlar va konferensiyalarning texnik hamda multimediya ta'minotini amalga oshirish.",
      "Texnik vositalarning uzluksiz va soz ishlashini nazorat qilish.",
      "O'quv binosidagi ovoz kuchaytirish hamda proyeksion tizimlardan samarali foydalanishni ta'minlash.",
      "Yangi zamonaviy ta'lim texnik vositalarini sinovdan o'tkazish va joriy qilish."
    ],
    staff: [
      { id: "otvb_1", name: "Xodjayev Sherzod", position: "Bo‘lim boshlig‘i", phone: "+998 62 224 81 20" },
      { id: "otvb_2", name: "Nurmetov Bunyod Alisherovich", position: "Multimediya va proyektorlar bo'yicha muhandis", phone: "+998 90 222 11 00" },
      { id: "otvb_3", name: "Qodirov Sardorbek Otabekovich", position: "Auditoriyalar va ovoz tizimlari texnigi", phone: "+998 94 333 22 11" }
    ]
  }
];

export const renderCenterIcon = (iconName, className = "w-10 h-10 text-blue-500") => {
  switch (iconName) {
    case 'BookOpen': return <BookOpen className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Library': return <Library className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Landmark': return <Landmark className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    default: return <Building className={className} />;
  }
};

export const getStoredCenters = () => {
  try {
    const data = localStorage.getItem('urspi_centers');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure every item has tasks and staff fallbacks if edited from old state
        return parsed.map(center => {
          const matchingInitial = initialCenters.find(ic => ic.id === center.id);
          return {
            ...center,
            tasks: (center.tasks && center.tasks.length > 0) ? center.tasks : (matchingInitial?.tasks || []),
            staff: (center.staff && center.staff.length > 0) ? center.staff : (matchingInitial?.staff || [])
          };
        });
      }
    }
  } catch (e) {
    console.error('Error reading centers from localStorage', e);
  }
  // Initialize default data if none exists
  localStorage.setItem('urspi_centers', JSON.stringify(initialCenters));
  return initialCenters;
};

export const saveStoredCenters = (centers) => {
  try {
    localStorage.setItem('urspi_centers', JSON.stringify(centers));
    window.dispatchEvent(new Event('urspi_centers_updated'));
  } catch (e) {
    console.error('Error saving centers to localStorage', e);
  }
};
