import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Wifi, 
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  Clock, 
  Home, 
  Users, 
  PhoneCall, 
  X, 
  Building, 
  UserCheck, 
  Key, 
  ChevronLeft,
  MapPin,
  Search
} from 'lucide-react';

const localTranslations = {
  uz: {
    breadcrumbHome: "Bosh sahifa",
    breadcrumbStudents: "Talabalarga",
    breadcrumbCurrent: "Yotoqxona",
    mainTitle: "QAYSI TURAR JOY SIZGA MOS?",
    ttjTitle: "Talabalar turar joyi",
    ttjDesc: "Kampus ichidagi rasmiy yotoqxona xonalari (TTJ)",
    ijaraTitle: "Talabalar uchun ijara xonadonlari",
    ijaraDesc: "Kampus tashqarisidagi mustaqil ijara variantlari",
    selectedBadge: "Tanlangan",
    
    // Stats
    statRooms: "180",
    statRoomsLabel: "Umumiy xonalar soni",
    statStudents: "1 240",
    statStudentsLabel: "Joylashgan talabalar soni",
    statBeds: "420+",
    statBedsLabel: "Bo'sh o'rinlar",
    
    // Amenities & Rules Header
    amenitiesHeader: "Qulayliklar",
    rulesHeader: "Bilishingiz kerak",
    
    // Amenities list
    wifiTitle: "Bepul internet",
    wifiDesc: "Har bir qavatda yuqori tezlikdagi Wi-Fi tarmog'i",
    securityTitle: "Doimiy nazorat",
    securityDesc: "Elektron karta orqali kirish va soatlik navbatchilik",
    studyTitle: "O'quv zonasi",
    studyDesc: "Har qavatda tinch o'qish xonasi va bosma texnika",
    kitchenTitle: "Umumiy oshxona",
    kitchenDesc: "Muzlatgich, plita va idish-tovoqlar bilan jihozlangan",
    
    // Rules list
    paymentTitle: "To'lov muddati",
    paymentDesc: "Har semestr boshida, bo'lib to'lash imkoniyati mavjud",
    curfewTitle: "Ichki tartib",
    curfewDesc: "Soat 23:00 dan keyin navbatchi ruxsati bilan kirish",
    guestsTitle: "Mehmonlar",
    guestsDesc: "Kunduzgi vaqtda ro'yxatga olingan holda qabul qilinadi",
    helpTitle: "Yordam xizmati",
    helpDesc: "Texnik nosozliklar uchun 1-qavatdagi dispetcher",
    
    // Application steps
    appTitle: "Ariza berish tartibi",
    appSubtitle: "Joy soni cheklangan — quyidagi bosqichlarni ketma-ket bajaring.",
    step1Title: "Ariza to'ldirish",
    step1Desc: "Shaxsiy kabinetda 'Yotoqxona' bo'limi orqali onlayn ariza yuboring.",
    step2Title: "Hujjat topshirish",
    step2Desc: "Pasport nusxasi va tibbiy ma'lumotnomani dekanatga taqdim eting.",
    step3Title: "Xona tanlash",
    step3Desc: "Bo'sh joylar ro'yxatidan xona turi va hamxonani belgilang.",
    step4Title: "To'lov va kalit",
    step4Desc: "Semestr to'lovini amalga oshirib, komendantdan kalit oling.",
    
    // Gallery
    galleryHeader: "Talabalar turar joyi foto galereyasi",
    gallerySub: "Yotoqxonamiz hayoti va sharoitlaridan yorqin lavhalar",

    // Rent Info
    rentHeader: "Tavsiya etiladigan ijara xonadonlari",
    rentSub: "Institutga yaqin bo'lgan, talabalar uchun maxsus ijara uylari",
    rentPrice: "Narxi",
    rentContact: "Aloqa",
    rentRoom: "xonali",
    rentDistance: "Institutgacha masofa",
    rentTipsHeader: "Ijaraga uy oluvchilar uchun maslahatlar",
    rentTip1Title: "Shartnoma tuzish",
    rentTip1Desc: "Ijara shartnomasini albatta rasmiylashtiring, bu soliq imtiyozlaridan foydalanishga yordam beradi.",
    rentTip2Title: "Jihozlarni tekshirish",
    rentTip2Desc: "Uyga kirishdan oldin suv, gaz va elektr jihozlarining ishlashini tekshirib oling.",
    rentTip3Title: "Transport qulayligi",
    rentTip3Desc: "Institutga jamoat transporti yoki piyoda borish qulay bo'lgan hududlarni tanlang.",
    
    // Buttons
    btnShowMore: "Ko'proq ko'rsatish",
    btnShowLess: "Kamroq ko'rsatish"
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbStudents: "Студентам",
    breadcrumbCurrent: "Общежитие",
    mainTitle: "КАКОЕ ЖИЛЬЕ ВАМ ПОДХОДИТ?",
    ttjTitle: "Студенческое общежитие",
    ttjDesc: "Официальные комнаты общежития внутри кампуса (TTJ)",
    ijaraTitle: "Аренда жилья для студентов",
    ijaraDesc: "Варианты независимой аренды за пределами кампуса",
    selectedBadge: "Выбрано",
    
    statRooms: "180",
    statRoomsLabel: "Общее количество комнат",
    statStudents: "1 240",
    statStudentsLabel: "Количество размещенных студентов",
    statBeds: "420+",
    statBedsLabel: "Свободные места",
    
    amenitiesHeader: "Удобства",
    rulesHeader: "Что нужно знать",
    
    wifiTitle: "Бесплатный интернет",
    wifiDesc: "Высокоскоростной Wi-Fi на каждом этаже",
    securityTitle: "Постоянный контроль",
    securityDesc: "Вход по электронным картам, круглосуточное дежурство",
    studyTitle: "Зона для учебы",
    studyDesc: "Тихие комнаты для занятий и принтер на каждом этаже",
    kitchenTitle: "Общая кухня",
    kitchenDesc: "Оборудована холодильником, плитой и посудой",
    
    paymentTitle: "Срок оплаты",
    paymentDesc: "Оплата в начале каждого семестра, доступна рассрочка",
    curfewTitle: "Внутренний распорядок",
    curfewDesc: "Вход после 23:00 только с разрешения дежурного",
    guestsTitle: "Посетители",
    guestsDesc: "Разрешены в дневное время с регистрацией",
    helpTitle: "Служба поддержки",
    helpDesc: "Диспетчер на 1 этаже для решения технических неполадок",
    
    appTitle: "Порядок подачи заявления",
    appSubtitle: "Количество мест ограничено — выполните следующие шаги по порядку.",
    step1Title: "Заполнение заявления",
    step1Desc: "Отправьте онлайн-заявление через личный кабинет в разделе 'Общежитие'.",
    step2Title: "Подача документов",
    step2Desc: "Предоставьте копию паспорта и медицинскую справку в деканат.",
    step3Title: "Выбор комнаты",
    step3Desc: "Выберите тип комнаты и сожителя из списка свободных мест.",
    step4Title: "Оплата и ключ",
    step4Desc: "Оплатите семестр и получите ключ у коменданта.",
    
    galleryHeader: "Фотогалерея общежития",
    gallerySub: "Яркие кадры из жизни и условий нашего общежития",

    rentHeader: "Рекомендуемые квартиры для аренды",
    rentSub: "Специальные арендные дома для студентов рядом с институтом",
    rentPrice: "Цена",
    rentContact: "Контакты",
    rentRoom: "-комнатная",
    rentDistance: "Расстояние до института",
    rentTipsHeader: "Советы для арендующих жилье",
    rentTip1Title: "Заключение договора",
    rentTip1Desc: "Обязательно оформляйте договор аренды, это поможет воспользоваться налоговыми льготами.",
    rentTip2Title: "Проверка оборудования",
    rentTip2Desc: "Перед въездом проверьте работу систем водоснабжения, газа и электричества.",
    rentTip3Title: "Удобство транспорта",
    rentTip3Desc: "Выбирайте районы, откуда удобно добираться до института пешком или на общественном транспорте.",
    
    btnShowMore: "Показать больше",
    btnShowLess: "Показать меньше"
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbStudents: "For Students",
    breadcrumbCurrent: "Dormitory",
    mainTitle: "WHICH ACCOMMODATION SUITS YOU?",
    ttjTitle: "Student Dormitory",
    ttjDesc: "Official dormitory rooms inside the campus (TTJ)",
    ijaraTitle: "Rental Housing for Students",
    ijaraDesc: "Independent rental options outside the campus",
    selectedBadge: "Selected",
    
    statRooms: "180",
    statRoomsLabel: "Total Number of Rooms",
    statStudents: "1 240",
    statStudentsLabel: "Accommodated Students",
    statBeds: "420+",
    statBedsLabel: "Available Beds",
    
    amenitiesHeader: "Amenities",
    rulesHeader: "What You Need to Know",
    
    wifiTitle: "Free Internet",
    wifiDesc: "High-speed Wi-Fi on every floor",
    securityTitle: "Constant Security",
    securityDesc: "Electronic card access, 24/7 duty staff",
    studyTitle: "Study Zone",
    studyDesc: "Quiet study room and printing facilities on each floor",
    kitchenTitle: "Shared Kitchen",
    kitchenDesc: "Equipped with refrigerator, stove, and utensils",
    
    paymentTitle: "Payment Deadline",
    paymentDesc: "At the beginning of each semester, installment plans available",
    curfewTitle: "Curfew & Rules",
    curfewDesc: "Entry after 23:00 is allowed only with duty staff permission",
    guestsTitle: "Guests & Visitors",
    guestsDesc: "Allowed during daytime hours with registration",
    helpTitle: "Support Service",
    helpDesc: "Receptionist on the 1st floor for technical issues",
    
    appTitle: "Application Process",
    appSubtitle: "Limited availability — complete the following steps in order.",
    step1Title: "Fill Application",
    step1Desc: "Submit an online application through the 'Dormitory' section in your personal cabinet.",
    step2Title: "Submit Documents",
    step2Desc: "Submit a passport copy and medical certificate to the dean's office.",
    step3Title: "Choose Room",
    step3Desc: "Select room type and roommate from the list of available places.",
    step4Title: "Payment & Key",
    step4Desc: "Pay the semester fee and collect the key from the warden.",
    
    galleryHeader: "Dormitory Photo Gallery",
    gallerySub: "Vibrant snapshots of our dormitory life and facilities",

    rentHeader: "Recommended Rental Apartments",
    rentSub: "Special rental houses for students near the institute",
    rentPrice: "Price",
    rentContact: "Contact",
    rentRoom: "room",
    rentDistance: "Distance to institute",
    rentTipsHeader: "Tips for Renting Students",
    rentTip1Title: "Sign a Contract",
    rentTip1Desc: "Be sure to draw up a formal lease agreement, as this helps you benefit from student tax deductions.",
    rentTip2Title: "Check Utilities",
    rentTip2Desc: "Before moving in, check the operation of gas, electricity, water, and appliances.",
    rentTip3Title: "Transport Access",
    rentTip3Desc: "Choose areas where it is convenient to walk to the institute or take public transport.",
    
    btnShowMore: "Show More",
    btnShowLess: "Show Less"
  }
};

const ttjImages = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200", // dormitory room
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200", // cozy beds
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200", // study desk
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200", // shared kitchen
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200", // lounge room
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200", // building exterior
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200", // campus building
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200", // campus life
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=1200", // library
  "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=1200", // outdoor study
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200", // desk planning
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200", // students laptops
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200", // cafe studying
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200", // classroom
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200", // writing student
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200", // college facade
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200", // library study
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200"  // exams
];

const apartmentImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800", // cozy living room
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800", // kitchen setup
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800", // clean kitchen
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800", // bright living room
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=800", // desk bedroom
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800", // grey couch
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800", // orange chair
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800", // double bedroom
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800", // warm wood
  "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800", // scandinavian
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800", // rustic Modern
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=800"  // plant filled
];

const rentApartments = [
  {
    id: 1,
    title: {
      uz: "Premium 2-Xonali Kvartira",
      ru: "Премиум 2-комнатная квартира",
      en: "Premium 2-Bedroom Apartment"
    },
    price: "1 800 000 UZS / oy",
    rooms: 2,
    distance: {
      uz: "Institutdan 500m masofada, piyoda 5 daqiqa",
      ru: "500м от института, 5 минут пешком",
      en: "500m from institute, 5 min walk"
    },
    contact: "+998 90 123-45-67",
    images: [apartmentImages[0], apartmentImages[1], apartmentImages[2]]
  },
  {
    id: 2,
    title: {
      uz: "Shinam 3-Xonali Kvartira (Sheriklikka)",
      ru: "Уютная 3-комнатная квартира (для сожительства)",
      en: "Cozy 3-Bedroom Apartment (for sharing)"
    },
    price: "1 400 000 UZS / kishi boshiga",
    rooms: 3,
    distance: {
      uz: "Institutdan 1.2km masofada, avtobusda 3 bekat",
      ru: "1.2км от института, 3 остановки на автобусе",
      en: "1.2km from institute, 3 bus stops"
    },
    contact: "+998 91 987-65-43",
    images: [apartmentImages[3], apartmentImages[4], apartmentImages[5]]
  },
  {
    id: 3,
    title: {
      uz: "Talabalar uchun 4-Xonali Hovli Uy",
      ru: "4-комнатный частный дом для студентов",
      en: "4-Bedroom Private House for Students"
    },
    price: "900 000 UZS / kishi boshiga",
    rooms: 4,
    distance: {
      uz: "Institutdan 800m masofada, piyoda 8 daqiqa",
      ru: "800м от института, 8 минут пешком",
      en: "800m from institute, 8 min walk"
    },
    contact: "+998 93 456-78-90",
    images: [apartmentImages[6], apartmentImages[7], apartmentImages[8]]
  },
  {
    id: 4,
    title: {
      uz: "Evroremont 2-Xonali Uy",
      ru: "Евроремонт 2-комнатная квартира",
      en: "Modern 2-Bedroom Apartment"
    },
    price: "2 300 000 UZS / oy",
    rooms: 2,
    distance: {
      uz: "Institutdan 400m masofada, piyoda 4 daqiqa",
      ru: "400м от института, 4 минуты пешком",
      en: "400m from institute, 4 min walk"
    },
    contact: "+998 99 111-22-33",
    images: [apartmentImages[9], apartmentImages[10], apartmentImages[11]]
  },
  {
    id: 5,
    title: {
      uz: "Shinam 1-Xonali Kvartira",
      ru: "Уютная 1-комнатная квартира",
      en: "Cozy 1-Bedroom Apartment"
    },
    price: "1 200 000 UZS / oy",
    rooms: 1,
    distance: {
      uz: "Institutdan 1.5km masofada, avtobusda 4 bekat",
      ru: "1.5км от института, 4 остановки на автобусе",
      en: "1.5km from institute, 4 bus stops"
    },
    contact: "+998 95 333-44-55",
    images: [apartmentImages[1], apartmentImages[4], apartmentImages[7]]
  },
  {
    id: 6,
    title: {
      uz: "Talabalar uchun 3-Xonali Kvartira",
      ru: "3-комнатная квартира для студентов",
      en: "3-Bedroom Apartment for Students"
    },
    price: "1 600 000 UZS / oy",
    rooms: 3,
    distance: {
      uz: "Institutdan 900m masofada, piyoda 9 daqiqa",
      ru: "900м от института, 9 минут пешком",
      en: "900m from institute, 9 min walk"
    },
    contact: "+998 97 777-88-99",
    images: [apartmentImages[2], apartmentImages[5], apartmentImages[8]]
  },
  {
    id: 7,
    title: {
      uz: "Keng 2-Xonali Uy",
      ru: "Просторная 2-комнатная квартира",
      en: "Spacious 2-Bedroom Apartment"
    },
    price: "2 000 000 UZS / oy",
    rooms: 2,
    distance: {
      uz: "Institutdan 700m masofada, piyoda 7 daqiqa",
      ru: "700м от института, 7 минут пешком",
      en: "700m from institute, 7 min walk"
    },
    contact: "+998 90 222-33-44",
    images: [apartmentImages[0], apartmentImages[9], apartmentImages[3]]
  },
  {
    id: 8,
    title: {
      uz: "Hamyonbop 1-Xonali Kvartira",
      ru: "Бюджетная 1-комнатная квартира",
      en: "Budget 1-Bedroom Apartment"
    },
    price: "1 100 000 UZS / oy",
    rooms: 1,
    distance: {
      uz: "Institutdan 2km masofada, jamoat transportida 10 daqiqa",
      ru: "2км от института, 10 минут на транспорте",
      en: "2km from institute, 10 min by transport"
    },
    contact: "+998 91 333-22-11",
    images: [apartmentImages[10], apartmentImages[6], apartmentImages[1]]
  },
  {
    id: 9,
    title: {
      uz: "Yangi ta'mirlangan 3-Xonali Uy",
      ru: "Новостройка 3-комнатная квартира",
      en: "Newly Renovated 3-Bedroom Apartment"
    },
    price: "2 600 000 UZS / oy",
    rooms: 3,
    distance: {
      uz: "Institutdan 600m masofada, piyoda 6 daqiqa",
      ru: "600м от института, 6 минут пешком",
      en: "600m from institute, 6 min walk"
    },
    contact: "+998 93 777-66-55",
    images: [apartmentImages[11], apartmentImages[5], apartmentImages[0]]
  },
  {
    id: 10,
    title: {
      uz: "Qulay 1-Xonali Kvartira",
      ru: "Удобная 1-комнатная квартира",
      en: "Comfortable 1-Bedroom Apartment"
    },
    price: "1 350 000 UZS / oy",
    rooms: 1,
    distance: {
      uz: "Institutdan 1.1km masofada, piyoda 11 daqiqa",
      ru: "1.1км от института, 11 минут пешком",
      en: "1.1km from institute, 11 min walk"
    },
    contact: "+998 94 444-55-66",
    images: [apartmentImages[2], apartmentImages[7], apartmentImages[10]]
  },
  {
    id: 11,
    title: {
      uz: "Sheriklikda turish uchun 2-Xonali Uy",
      ru: "2-комнатная квартира для сожительства",
      en: "2-Bedroom Apartment for Sharing"
    },
    price: "1 000 000 UZS / kishi boshiga",
    rooms: 2,
    distance: {
      uz: "Institutdan 1km masofada, piyoda 10 daqiqa",
      ru: "1км от института, 10 минут пешком",
      en: "1km from institute, 10 min walk"
    },
    contact: "+998 98 888-99-00",
    images: [apartmentImages[4], apartmentImages[8], apartmentImages[11]]
  },
  {
    id: 12,
    title: {
      uz: "Zamonaviy 2-Xonali Uy",
      ru: "Современная 2-комнатная квартира",
      en: "Modern 2-Bedroom Apartment"
    },
    price: "2 100 000 UZS / oy",
    rooms: 2,
    distance: {
      uz: "Institutdan 450m masofada, piyoda 4 daqiqa",
      ru: "450м от института, 4 минуты пешком",
      en: "450m from institute, 4 min walk"
    },
    contact: "+998 99 999-00-11",
    images: [apartmentImages[3], apartmentImages[6], apartmentImages[9]]
  }
];

function ApartmentCard({ apt, currentLang, trans, onZoom }) {
  const [imgIdx, setImgIdx] = useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === 0 ? apt.images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === apt.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Carousel */}
      <div 
        onClick={() => onZoom(apt.images, imgIdx)}
        className="aspect-[16/10] overflow-hidden relative group cursor-pointer"
      >
        <img 
          src={apt.images[imgIdx]} 
          alt={apt.title[currentLang]} 
          className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
        />
        
        {/* Navigation arrows (visible on hover) */}
        <button 
          onClick={handlePrev}
          type="button"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 animate-in fade-in duration-200"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={handleNext}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 animate-in fade-in duration-200"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Zoom button on top-right */}
        <button 
          onClick={() => onZoom(apt.images, imgIdx)}
          type="button"
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-lg transition-transform hover:scale-110 z-10 flex items-center justify-center animate-in fade-in duration-200"
          title="Kattalashtirish"
        >
          <Search className="w-4 h-4 text-[#0c1f4a]" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {apt.images.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === imgIdx ? 'bg-white w-3.5' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Room tag */}
        <span className="absolute bottom-3 left-3 bg-[#0c1f4a]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
          {apt.rooms} {trans.rentRoom}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-extrabold text-slate-950 text-base line-clamp-1">
            {apt.title[currentLang]}
          </h4>
          <div className="flex items-center gap-2 text-slate-500 text-xs mt-3">
            <MapPin className="w-4 h-4 text-[#0c1f4a] shrink-0" />
            <span>{apt.distance[currentLang]}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{trans.rentPrice}</div>
            <div className="text-base font-black text-[#0c1f4a]">{apt.price}</div>
          </div>
          <a 
            href={`tel:${apt.contact}`} 
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#0c1f4a] px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{trans.rentContact}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DormitoryPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'uz';
  const trans = localTranslations[currentLang] || localTranslations.uz;

  const [activeTab, setActiveTab] = useState('ttj'); // 'ttj' or 'ijara'
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(6);

  const openLightbox = (imagesList, index) => {
    setLightboxImages(imagesList);
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="flex-1 bg-slate-50">
      {/* ── 1. BREADCRUMBS ── */}
      <div className="w-full bg-[#0c1f4a] py-5">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {trans.breadcrumbHome}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white/85">{trans.breadcrumbStudents}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">{trans.breadcrumbCurrent}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* ── 2. SELECTION CARDS (TAB SWITCH) ── */}
        <div className="text-center mb-10">
          <h2 className="text-[#0c1f4a] text-3xl font-extrabold tracking-tight mb-8">
            {trans.mainTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1: TTJ */}
            <div 
              onClick={() => setActiveTab('ttj')}
              className={`group relative rounded-3xl p-6 bg-white border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'ttj' ? 'border-[#0c1f4a] ring-2 ring-[#0c1f4a]/20' : 'border-slate-200 opacity-80 hover:opacity-100'}`}
            >
              {activeTab === 'ttj' && (
                <span className="absolute top-4 right-4 bg-[#0c1f4a] text-white text-xs px-3 py-1 rounded-full font-bold">
                  {trans.selectedBadge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${activeTab === 'ttj' ? 'bg-[#0c1f4a]/5 text-[#0c1f4a]' : 'bg-slate-100 text-slate-500'}`}>
                  <Building className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0c1f4a] transition-colors">
                    {trans.ttjTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {trans.ttjDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Ijara */}
            <div 
              onClick={() => setActiveTab('ijara')}
              className={`group relative rounded-3xl p-6 bg-white border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${activeTab === 'ijara' ? 'border-[#0c1f4a] ring-2 ring-[#0c1f4a]/20' : 'border-slate-200 opacity-80 hover:opacity-100'}`}
            >
              {activeTab === 'ijara' && (
                <span className="absolute top-4 right-4 bg-[#0c1f4a] text-white text-xs px-3 py-1 rounded-full font-bold">
                  {trans.selectedBadge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${activeTab === 'ijara' ? 'bg-[#0c1f4a]/5 text-[#0c1f4a]' : 'bg-slate-100 text-slate-500'}`}>
                  <Home className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0c1f4a] transition-colors">
                    {trans.ijaraTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {trans.ijaraDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CONTENT AREA: TAB TTJ ── */}
        {activeTab === 'ttj' ? (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#0c1f4a] via-[#122b66] to-[#1e3a8a] border border-white/10 rounded-3xl p-7 text-white flex items-center gap-5 shadow-[0_10px_30px_rgba(12,31,74,0.15)] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(12,31,74,0.25)] transition-all duration-300">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.07] group-hover:scale-115 group-hover:rotate-12 transition-all duration-500 ease-out">
                  <Building className="w-36 h-36 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sky-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Building className="w-7 h-7" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{trans.statRooms}</div>
                  <div className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest mt-2 leading-snug">{trans.statRoomsLabel}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0c1f4a] via-[#122b66] to-[#1e3a8a] border border-white/10 rounded-3xl p-7 text-white flex items-center gap-5 shadow-[0_10px_30px_rgba(12,31,74,0.15)] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(12,31,74,0.25)] transition-all duration-300">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.07] group-hover:scale-115 group-hover:rotate-12 transition-all duration-500 ease-out">
                  <UserCheck className="w-36 h-36 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sky-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{trans.statStudents}</div>
                  <div className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest mt-2 leading-snug">{trans.statStudentsLabel}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0c1f4a] via-[#122b66] to-[#1e3a8a] border border-white/10 rounded-3xl p-7 text-white flex items-center gap-5 shadow-[0_10px_30px_rgba(12,31,74,0.15)] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(12,31,74,0.25)] transition-all duration-300">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.07] group-hover:scale-115 group-hover:rotate-12 transition-all duration-500 ease-out">
                  <Key className="w-36 h-36 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sky-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Key className="w-7 h-7" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">{trans.statBeds}</div>
                  <div className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest mt-2 leading-snug">{trans.statBedsLabel}</div>
                </div>
              </div>
            </div>

            {/* Amenities & Rules Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
              {/* Amenities */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2.5">
                  <span className="h-6 w-2 rounded-full bg-[#0c1f4a]" />
                  {trans.amenitiesHeader}
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.wifiTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.wifiDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.securityTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.securityDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.studyTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.studyDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.kitchenTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.kitchenDesc}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Need to know */}
              <div>
                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2.5">
                  <span className="h-6 w-2 rounded-full bg-[#0c1f4a]" />
                  {trans.rulesHeader}
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.paymentTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.paymentDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.curfewTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.curfewDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.guestsTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.guestsDesc}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2.5 bg-slate-100 text-[#0c1f4a] rounded-xl mt-1 shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{trans.helpTitle}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{trans.helpDesc}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Application Steps */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">{trans.appTitle}</h3>
                <p className="text-sm text-slate-500 mt-1">{trans.appSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "01", title: trans.step1Title, desc: trans.step1Desc },
                  { step: "02", title: trans.step2Title, desc: trans.step2Desc },
                  { step: "03", title: trans.step3Title, desc: trans.step3Desc },
                  { step: "04", title: trans.step4Title, desc: trans.step4Desc }
                ].map((item, idx) => (
                  <div key={idx} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-[#0c1f4a]/5 hover:border-[#0c1f4a]/20 transition-all duration-300">
                    <div className="absolute top-4 left-6 text-[#0c1f4a] text-3xl font-extrabold opacity-80 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="mt-8">
                      <h4 className="font-bold text-slate-950 text-base">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery ("va albatta galereya qo'y") */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900">{trans.galleryHeader}</h3>
                <p className="text-sm text-slate-500 mt-1">{trans.gallerySub}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ttjImages.slice(0, visibleGalleryCount).map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => openLightbox(ttjImages, idx)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-100"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery item ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="bg-white/95 px-4 py-2 rounded-xl text-xs font-bold text-[#0c1f4a] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {currentLang === 'uz' ? "Kattalashtirish" : currentLang === 'ru' ? "Увеличить" : "Zoom Image"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {visibleGalleryCount < ttjImages.length && (
                <div className="mt-8 text-center animate-in fade-in duration-300">
                  <button
                    type="button"
                    onClick={() => setVisibleGalleryCount(prev => prev + 6)}
                    className="px-8 py-3.5 bg-transparent border-2 border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {trans.btnShowMore}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── 4. CONTENT AREA: TAB IJARA ── */
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Recommended Rental Houses */}
            <div>
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900">{trans.rentHeader}</h3>
                <p className="text-sm text-slate-500 mt-1">{trans.rentSub}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rentApartments.slice(0, visibleCount).map((apt) => (
                  <ApartmentCard 
                    key={apt.id} 
                    apt={apt} 
                    currentLang={currentLang} 
                    trans={trans} 
                    onZoom={openLightbox} 
                  />
                ))}
              </div>

              {/* Show More/Less Button */}
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => (prev === 6 ? 12 : 6))}
                  className="px-8 py-3.5 bg-transparent border-2 border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {visibleCount === 6 ? trans.btnShowMore : trans.btnShowLess}
                </button>
              </div>
            </div>

            {/* Advice/Tips for renting */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2.5">
                <span className="h-6 w-2 rounded-full bg-[#0c1f4a]" />
                {trans.rentTipsHeader}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#0c1f4a] text-base">{trans.rentTip1Title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{trans.rentTip1Desc}</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#0c1f4a] text-base">{trans.rentTip2Title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{trans.rentTip2Desc}</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#0c1f4a] text-base">{trans.rentTip3Title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{trans.rentTip3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation left */}
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <img 
            src={lightboxImages[lightboxIdx]} 
            alt={`Lightbox image ${lightboxIdx + 1}`} 
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-transform animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} 
          />

          {/* Navigation right */}
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
            onClick={handleNextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image counter indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-semibold text-sm">
            {lightboxIdx + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </main>
  );
}
