import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  PieChart, 
  ChevronDown, 
  Search, 
  Info, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeftRight, 
  CreditCard, 
  FileText,
  ChevronRight,
  X,
  MapPin,
  Phone,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const localTranslations = {
  uz: {
    breadcrumbHome: "Bosh sahifa",
    breadcrumbAdmission: "Abituriyent",
    breadcrumbCurrent: "Bakalavriat",
    
    // Stats
    statTotalQuota: "UMUMIY KVOTA",
    statTotalQuotaSub: "Kelgusi o'quv yili uchun",
    statRegistered: "RO'YXATDAN O'TGANLAR",
    statRegisteredSub: "+12% kechagiga nisbatan",
    statAvgScore: "O'RTACHA BALL (2023)",
    statAvgScoreSub: "Eng yuqori 189.0 ball",
    statGrantContract: "GRANT/KONTRAKT",
    
    // Table Section
    tableTitle: "Yo'nalishlar kesimida qabul kvotalari",
    tableSubtitle: "Barcha ta'lim yo'nalishlari bo'yicha batafsil ma'lumotlar",
    colCodeName: "KOD VA YO'NALISH NOMI",
    colTotalQuota: "UMUMIY KVOTA",
    colGrant: "DAVLAT GRANTI",
    colContract: "TO'LOV-KONTRAKT",
    colAction: "AMAL",
    btnDetails: "Batafsil",
    
    // Filters
    filterFullTime: "Kunduzgi",
    filterPartTime: "Sirtqi",
    filterEvening: "Kechki",
    filterLangUz: "O'zbek tili",
    filterLangRu: "Rus tili",
    
    // Resource Cards
    cardContractTitle: "Kontrakt to'lov summasi",
    cardContractDesc: "Yo'nalishlar bo'yicha joriy yilgi shartnoma stavkalari.",
    cardMandateTitle: "Mandat natijalari",
    cardMandateDesc: "Qabul natijalarini pasport raqami orqali tekshirish.",
    cardTransferTitle: "O'qishni ko'chirish",
    cardTransferDesc: "Boshqa OTMdan o'qishni ko'chirish tartibi va arizalar.",

    // Modals
    modalClose: "Yopish",
    modalSubjectTitle: "Imtihon fanlari",
    modalSubject1: "1-blok (3.1 ball):",
    modalSubject2: "2-blok (2.1 ball):",
    modalSubjectMandatory: "Majburiy fanlar (1.1 ball):",
    modalPassingScores: "O'tish ballari (2023)",
    modalPassingGrant: "Davlat granti:",
    modalPassingContract: "To'lov-kontrakt:",
    modalDuration: "O'qish muddati:",
    modalDurationVal: "4 yil",
    modalDocumentsRequired: "Kerakli hujjatlar:",
    modalDocsList: [
      "Pasport yoki ID karta (nusxa)",
      "Attestat yoki Diplom (asl nusxa)",
      "Rasm 3x4 (6 dona)",
      "Imtiyoz hujjatlari (agar mavjud bo'lsa)"
    ]
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbAdmission: "Абитуриент",
    breadcrumbCurrent: "Бакалавриат",
    
    // Stats
    statTotalQuota: "ОБЩАЯ КВОТА",
    statTotalQuotaSub: "На следующий учебный год",
    statRegistered: "ЗАРЕГИСТРИРОВАНО",
    statRegisteredSub: "+12% по сравнению со вчерашним днем",
    statAvgScore: "СРЕДНИЙ БАЛЛ (2023)",
    statAvgScoreSub: "Максимальный 189.0 баллов",
    statGrantContract: "ГРАНТ/КОНТРАКТ",
    
    // Table Section
    tableTitle: "Квоты приема по направлениям",
    tableSubtitle: "Детальная информация по всем образовательным направлениям",
    colCodeName: "КОД И НАЗВАНИЕ НАПРАВЛЕНИЯ",
    colTotalQuota: "ОБЩАЯ КВОТА",
    colGrant: "ГОСУДАРСТВЕННЫЙ ГРАНТ",
    colContract: "ПЛАТНЫЙ КОНТРАКТ",
    colAction: "ДЕЙСТВИЕ",
    btnDetails: "Подробнее",
    
    // Filters
    filterFullTime: "Дневное",
    filterPartTime: "Заочное",
    filterEvening: "Вечернее",
    filterLangUz: "Узбекский язык",
    filterLangRu: "Русский язык",
    
    // Resource Cards
    cardContractTitle: "Сумма оплаты контракта",
    cardContractDesc: "Стоимость обучения по направлениям на текущий год.",
    cardMandateTitle: "Результаты мандата",
    cardMandateDesc: "Проверка результатов приема по номеру паспорта.",
    cardTransferTitle: "Перевод обучения",
    cardTransferDesc: "Порядок перевода из других вузов и подача заявлений.",

    // Modals
    modalClose: "Закрыть",
    modalSubjectTitle: "Экзаменационные предметы",
    modalSubject1: "1-й блок (3.1 балла):",
    modalSubject2: "2-й блок (2.1 балла):",
    modalSubjectMandatory: "Обязательные предметы (1.1 балла):",
    modalPassingScores: "Проходные баллы (2023)",
    modalPassingGrant: "Госгрант:",
    modalPassingContract: "Контракт:",
    modalDuration: "Срок обучения:",
    modalDurationVal: "4 года",
    modalDocumentsRequired: "Необходимые документы:",
    modalDocsList: [
      "Паспорт или ID-карта (копия)",
      "Аттестат или Диплом (оригинал)",
      "Фото 3x4 (6 штук)",
      "Документы о льготах (при наличии)"
    ]
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbAdmission: "Admission",
    breadcrumbCurrent: "Undergraduate",
    
    // Stats
    statTotalQuota: "TOTAL QUOTA",
    statTotalQuotaSub: "For the next academic year",
    statRegistered: "REGISTERED APPLICANTS",
    statRegisteredSub: "+12% compared to yesterday",
    statAvgScore: "AVERAGE SCORE (2023)",
    statAvgScoreSub: "Highest 189.0 score",
    statGrantContract: "GRANT / CONTRACT",
    
    // Table Section
    tableTitle: "Admission Quotas by Directions",
    tableSubtitle: "Detailed information for all fields of study",
    colCodeName: "CODE & DIRECTION NAME",
    colTotalQuota: "TOTAL QUOTA",
    colGrant: "STATE GRANT",
    colContract: "PAID CONTRACT",
    colAction: "ACTION",
    btnDetails: "Details",
    
    // Filters
    filterFullTime: "Full-time",
    filterPartTime: "Part-time",
    filterEvening: "Evening",
    filterLangUz: "Uzbek language",
    filterLangRu: "Russian language",
    
    // Resource Cards
    cardContractTitle: "Contract Payment Fees",
    cardContractDesc: "Current contract tuition fees by study fields.",
    cardMandateTitle: "Mandate Results",
    cardMandateDesc: "Check admission results via passport number.",
    cardTransferTitle: "Transfer Study",
    cardTransferDesc: "Transfer process from other universities & applications.",

    // Modals
    modalClose: "Close",
    modalSubjectTitle: "Exam Subjects",
    modalSubject1: "Block 1 (3.1 pts):",
    modalSubject2: "Block 2 (2.1 pts):",
    modalSubjectMandatory: "Mandatory subjects (1.1 pts):",
    modalPassingScores: "Passing Scores (2023)",
    modalPassingGrant: "State Grant:",
    modalPassingContract: "Contract:",
    modalDuration: "Study Duration:",
    modalDurationVal: "4 years",
    modalDocumentsRequired: "Required Documents:",
    modalDocsList: [
      "Passport or ID card (copy)",
      "Certificate or Diploma (original)",
      "Photo 3x4 (6 pieces)",
      "Privilege certificates (if applicable)"
    ]
  }
};

const directionData = {
  kunduzgi: {
    uz: [
      { code: "5111700", name: "Boshlang'ich ta'lim", quota: 150, grant: 40, contract: 110, sub1: "Pedagogika", sub2: "Matematika", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 145.2, scoreContract: 105.8 },
      { code: "5111300", name: "Ona tili va adabiyoti (Filologiya)", quota: 120, grant: 30, contract: 90, sub1: "Ona tili va adabiyot", sub2: "Chet tili", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 139.8, scoreContract: 98.4 },
      { code: "5110600", name: "Tarix o'qish metodikasi", quota: 100, grant: 25, contract: 75, sub1: "Tarix", sub2: "Geografiya", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 148.5, scoreContract: 112.1 },
      { code: "5111100", name: "Matematika va informatika", quota: 80, grant: 20, contract: 60, sub1: "Matematika", sub2: "Fizika", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 135.4, scoreContract: 89.2 },
      { code: "5110900", name: "Pedagogika va psixologiya", quota: 90, grant: 15, contract: 75, sub1: "Biologiya", sub2: "Ona tili", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 128.6, scoreContract: 90.5 },
      { code: "5111400", name: "Xorijiy til va adabiyoti: Ingliz tili", quota: 110, grant: 25, contract: 85, sub1: "Ingliz tili", sub2: "Ona tili", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: 155.6, scoreContract: 118.4 }
    ],
    ru: [
      { code: "5111700", name: "Начальное образование (Русский язык)", quota: 50, grant: 10, contract: 40, sub1: "Педагогика", sub2: "Математика", mandatory: "Русский язык, Математика, История Узбекистана", scoreGrant: 130.4, scoreContract: 92.5 },
      { code: "5111300", name: "Родной язык и литература (Русский язык и литература)", quota: 40, grant: 8, contract: 32, sub1: "Русский язык и литература", sub2: "Иностранный язык", mandatory: "Русский язык, Математика, История Узбекистана", scoreGrant: 125.1, scoreContract: 85.0 },
      { code: "5111400", name: "Иностранный язык и литература: Английский язык (для русских групп)", quota: 30, grant: 5, contract: 25, sub1: "Английский язык", sub2: "Русский язык", mandatory: "Русский язык, Математика, История Узбекистана", scoreGrant: 148.9, scoreContract: 104.2 }
    ]
  },
  sirtqi: {
    uz: [
      { code: "5111700", name: "Boshlang'ich ta'lim (Sirtqi)", quota: 100, grant: 0, contract: 100, sub1: "Pedagogika", sub2: "Matematika", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 100.5 },
      { code: "5111300", name: "Ona tili va adabiyoti (Sirtqi)", quota: 80, grant: 0, contract: 80, sub1: "Ona tili va adabiyot", sub2: "Chet tili", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 92.1 },
      { code: "5110600", name: "Tarix o'qish metodikasi (Sirtqi)", quota: 60, grant: 0, contract: 60, sub1: "Tarix", sub2: "Geografiya", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 104.8 },
      { code: "5111100", name: "Matematika va informatika (Sirtqi)", quota: 50, grant: 0, contract: 50, sub1: "Matematika", sub2: "Fizika", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 85.1 }
    ],
    ru: [
      { code: "5111700", name: "Начальное образование (Заочно, Русский язык)", quota: 30, grant: 0, contract: 30, sub1: "Педагогика", sub2: "Математика", mandatory: "Русский язык, Математика, История Узбекистана", scoreGrant: "N/A", scoreContract: 88.4 }
    ]
  },
  kechki: {
    uz: [
      { code: "5111700", name: "Boshlang'ich ta'lim (Kechki)", quota: 50, grant: 0, contract: 50, sub1: "Pedagogika", sub2: "Matematika", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 98.2 },
      { code: "5111300", name: "Ona tili va adabiyoti (Kechki)", quota: 40, grant: 0, contract: 40, sub1: "Ona tili va adabiyot", sub2: "Chet tili", mandatory: "Ona tili, Matematika, O'zbekiston tarixi", scoreGrant: "N/A", scoreContract: 90.0 }
    ],
    ru: []
  }
};

export default function BakalavriatPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'uz';
  const trans = localTranslations[currentLang] || localTranslations.uz;

  // Filters state
  const [educationMode, setEducationMode] = useState('kunduzgi'); // 'kunduzgi', 'sirtqi', 'kechki'
  const [languageMode, setLanguageMode] = useState('uz'); // 'uz', 'ru'
  const [selectedYear, setSelectedYear] = useState('2026/2027');
  const [selectedDirection, setSelectedDirection] = useState(null);

  // Resource interaction states
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'contract', 'mandate', 'transfer'
  const [mandatePassport, setMandatePassport] = useState('');
  const [mandateResult, setMandateResult] = useState(null);

  // Year offset configurations for dynamic statistics and table scaling
  const yearOffsets = {
    '2026/2027': { quotaMul: 1.15, scoreAdd: 2.5, registered: 4890, avgScore: 158.5, totalQuota: 1420 },
    '2025/2026': { quotaMul: 1.0, scoreAdd: 0.0, registered: 4522, avgScore: 156.4, totalQuota: 1380 },
    '2024/2025': { quotaMul: 0.95, scoreAdd: -1.5, registered: 4120, avgScore: 154.2, totalQuota: 1310 },
    '2023/2024': { quotaMul: 0.9, scoreAdd: -3.0, registered: 3850, avgScore: 152.0, totalQuota: 1250 },
  };

  const currentOffset = yearOffsets[selectedYear] || yearOffsets['2026/2027'];

  // Dynamic table data
  const rawDirections = (directionData[educationMode] && directionData[educationMode][languageMode]) || [];
  const directions = rawDirections.map(dir => {
    const scale = currentOffset.quotaMul;
    const scoreDiff = currentOffset.scoreAdd;
    
    const quota = Math.round(dir.quota * scale);
    const grant = dir.grant > 0 ? Math.round(dir.grant * scale) : 0;
    const contract = quota - grant;
    
    const scoreGrant = typeof dir.scoreGrant === 'number' 
      ? parseFloat((dir.scoreGrant + scoreDiff).toFixed(1)) 
      : dir.scoreGrant;
    const scoreContract = typeof dir.scoreContract === 'number' 
      ? parseFloat((dir.scoreContract + scoreDiff).toFixed(1)) 
      : dir.scoreContract;
      
    return {
      ...dir,
      quota,
      grant,
      contract,
      scoreGrant,
      scoreContract
    };
  });

  const handleCheckMandate = (e) => {
    e.preventDefault();
    if (!mandatePassport.trim()) return;
    
    // Mock simulation
    const firstChar = mandatePassport.trim().charAt(0).toUpperCase();
    if (firstChar === 'A') {
      setMandateResult({
        status: 'recommended',
        text: currentLang === 'uz' ? "Tabriklaymiz! Siz Davlat Granti asosida o'qishga tavsiya etildingiz." :
              currentLang === 'ru' ? "Поздравляем! Вы рекомендованы к зачислению на основе государственного гранта." :
              "Congratulations! You have been recommended for admission on a State Grant basis.",
        score: "168.4 ball",
        direction: currentLang === 'uz' ? "Matematika va informatika" : currentLang === 'ru' ? "Математика и информатика" : "Mathematics and Computer Science"
      });
    } else {
      setMandateResult({
        status: 'contract',
        text: currentLang === 'uz' ? "Tabriklaymiz! Siz To'lov-kontrakt asosida o'qishga tavsiya etildingiz." :
              currentLang === 'ru' ? "Поздравляем! Вы рекомендованы к зачислению на платно-контрактной основе." :
              "Congratulations! You have been recommended for admission on a Paid-Contract basis.",
        score: "124.5 ball",
        direction: currentLang === 'uz' ? "Boshlang'ich ta'lim" : currentLang === 'ru' ? "Начальное образование" : "Primary Education"
      });
    }
  };

  return (
    <main className="flex-1 bg-slate-50 min-h-screen">
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
                  <span className="text-white/85">{trans.breadcrumbAdmission}</span>
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

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-10">
        
        {/* ── 2. STATISTIC DASHBOARD ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Umumiy Kvota */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(12,31,74,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{trans.statTotalQuota}</span>
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#0c1f4a]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900">{currentOffset.totalQuota.toLocaleString()}</h3>
              <p className="text-xs text-slate-400 mt-1">{trans.statTotalQuotaSub}</p>
            </div>
          </div>

          {/* Card 2: Ro'yxatdan o'tganlar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(12,31,74,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{trans.statRegistered}</span>
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#0c1f4a]">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900">{currentOffset.registered.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 3: O'rtacha Ball */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(12,31,74,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                {trans.statAvgScore.replace('(2023)', `(${parseInt(selectedYear.split('/')[0]) - 1})`)}
              </span>
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#0c1f4a]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900">{currentOffset.avgScore.toFixed(1)}</h3>
              <p className="text-xs text-slate-400 mt-1">{trans.statAvgScoreSub}</p>
            </div>
          </div>

          {/* Card 4: Grant/Kontrakt */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(12,31,74,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{trans.statGrantContract}</span>
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#0c1f4a]">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900">25% / 75%</h3>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div className="bg-[#0c1f4a] h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3. QUOTA TABLE SECTION ── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden">
          
          {/* Header & Filters */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
            <div>
              <h2 className="text-[#0c1f4a] text-xl md:text-2xl font-extrabold tracking-tight">
                {trans.tableTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {trans.tableSubtitle}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter 1: Education Mode */}
              <div className="relative">
                <select
                  value={educationMode}
                  onChange={(e) => setEducationMode(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] transition cursor-pointer"
                >
                  <option value="kunduzgi">{trans.filterFullTime}</option>
                  <option value="sirtqi">{trans.filterPartTime}</option>
                  <option value="kechki">{trans.filterEvening}</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Filter 2: Academic Year */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] transition cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Filter 3: Language Mode */}
              <div className="relative">
                <select
                  value={languageMode}
                  onChange={(e) => setLanguageMode(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] transition cursor-pointer"
                >
                  <option value="uz">{trans.filterLangUz}</option>
                  <option value="ru">{trans.filterLangRu}</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            {directions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/45 text-[#0c1f4a] font-bold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4.5 font-extrabold">{trans.colCodeName}</th>
                    <th className="px-6 py-4.5 font-extrabold text-center">{trans.colTotalQuota}</th>
                    <th className="px-6 py-4.5 font-extrabold text-center">{trans.colGrant}</th>
                    <th className="px-6 py-4.5 font-extrabold text-center">{trans.colContract}</th>
                    <th className="px-6 py-4.5 font-extrabold text-center">{trans.colAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {directions.map((dir, idx) => (
                    <tr key={dir.code} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs px-2 py-1 bg-slate-100 text-[#0c1f4a] rounded shrink-0">{dir.code}</span>
                          <span className="text-slate-800">{dir.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-slate-900">{dir.quota}</td>
                      <td className="px-6 py-5 text-center text-emerald-600">{dir.grant}</td>
                      <td className="px-6 py-5 text-center text-slate-700">{dir.contract}</td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => setSelectedDirection(dir)}
                          className="px-4 py-1.5 bg-slate-100 hover:bg-[#0c1f4a] hover:text-white text-[#0c1f4a] font-bold rounded-lg text-xs transition duration-200"
                        >
                          {trans.btnDetails}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Info className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold">Yo'nalishlar mavjud emas.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. THREE CARDS RESOURCE GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Kontrakt summasi */}
          <div 
            onClick={() => setActiveInfoModal('contract')}
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(12,31,74,0.08)] -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-3.5 bg-slate-50 text-[#0c1f4a] rounded-2xl w-fit group-hover:bg-[#0c1f4a] group-hover:text-white transition duration-300">
                <CreditCard className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-6 group-hover:text-[#0c1f4a] transition duration-200">
                {trans.cardContractTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {trans.cardContractDesc}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-xs font-bold text-[#0c1f4a] opacity-80 group-hover:opacity-100">
              <span>Batafsil ma'lumot</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Mandat natijalari */}
          <div 
            onClick={() => setActiveInfoModal('mandate')}
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(12,31,74,0.08)] -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-3.5 bg-slate-50 text-[#0c1f4a] rounded-2xl w-fit group-hover:bg-[#0c1f4a] group-hover:text-white transition duration-300">
                <CheckCircle2 className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-6 group-hover:text-[#0c1f4a] transition duration-200">
                {trans.cardMandateTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {trans.cardMandateDesc}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-xs font-bold text-[#0c1f4a] opacity-80 group-hover:opacity-100">
              <span>Tekshirish</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: O'qishni ko'chirish */}
          <div 
            onClick={() => setActiveInfoModal('transfer')}
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(12,31,74,0.08)] -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="p-3.5 bg-slate-50 text-[#0c1f4a] rounded-2xl w-fit group-hover:bg-[#0c1f4a] group-hover:text-white transition duration-300">
                <ArrowLeftRight className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-6 group-hover:text-[#0c1f4a] transition duration-200">
                {trans.cardTransferTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {trans.cardTransferDesc}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-xs font-bold text-[#0c1f4a] opacity-80 group-hover:opacity-100">
              <span>Tartib va arizalar</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

      </div>

      {/* ── 5. DETAIL DIALOG MODAL (Direction details) ── */}
      {selectedDirection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0c1f4a] p-6 text-white relative">
              <button 
                onClick={() => setSelectedDirection(null)}
                className="absolute top-6 right-6 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs bg-white/15 px-2.5 py-1 rounded font-bold uppercase tracking-wider">{selectedDirection.code}</span>
              <h3 className="text-xl md:text-2xl font-black mt-3 leading-snug">{selectedDirection.name}</h3>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Subjects */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0c1f4a]" />
                  <span>{trans.modalSubjectTitle}</span>
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">{trans.modalSubject1}</span>
                    <span className="font-extrabold text-[#0c1f4a]">{selectedDirection.sub1}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">{trans.modalSubject2}</span>
                    <span className="font-extrabold text-[#0c1f4a]">{selectedDirection.sub2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">{trans.modalSubjectMandatory}</span>
                    <span className="font-semibold text-slate-600 text-right">{selectedDirection.mandatory}</span>
                  </div>
                </div>
              </div>

              {/* Passing scores & details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Scores */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#0c1f4a]" />
                    <span>{trans.modalPassingScores.replace('(2023)', `(${parseInt(selectedYear.split('/')[0]) - 1})`)}</span>
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800">{trans.modalPassingGrant}</span>
                      <span className="font-black text-emerald-600">{selectedDirection.scoreGrant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800">{trans.modalPassingContract}</span>
                      <span className="font-black text-slate-900">{selectedDirection.scoreContract}</span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#0c1f4a]" />
                    <span>O'quv shartlari</span>
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800">{trans.modalDuration}</span>
                      <span className="font-extrabold text-slate-900">{trans.modalDurationVal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800">Ta'lim turi:</span>
                      <span className="font-extrabold text-slate-900 uppercase">{educationMode}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Required Documents */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0c1f4a]" />
                  <span>{trans.modalDocumentsRequired}</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-slate-50 rounded-2xl p-4 text-sm text-slate-700">
                  {trans.modalDocsList.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedDirection(null)}
                className="px-6 py-2 bg-slate-200 hover:bg-[#0c1f4a] hover:text-white text-[#0c1f4a] font-bold rounded-xl text-sm transition"
              >
                {trans.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. RESOURCE SPECIFIC DETAILS MODAL ── */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => {
                setActiveInfoModal(null);
                setMandatePassport('');
                setMandateResult(null);
              }}
              className="absolute top-6 right-6 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* A. Kontrakt to'lovlari details */}
              {activeInfoModal === 'contract' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#0c1f4a]/5 text-[#0c1f4a] rounded-2xl">
                      <CreditCard className="w-6.5 h-6.5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{trans.cardContractTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    Urganch davlat pedagogika institutida bakalavriat ta'lim yo'nalishlari bo'yicha joriy yilgi bazaviy kontrakt miqdorlari:
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-4 divide-y divide-slate-100 text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="font-bold text-slate-800">Gumanitar va pedagogika sohalari</span>
                      <span className="font-extrabold text-[#0c1f4a]">6 400 000 UZS / yil</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="font-bold text-slate-800">Matematika va axborot texnologiyalari</span>
                      <span className="font-extrabold text-[#0c1f4a]">6 400 000 UZS / yil</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="font-bold text-slate-800">Sirtqi ta'lim shakli (barcha yo'nalishlar)</span>
                      <span className="font-extrabold text-[#0c1f4a]">7 200 000 UZS / yil</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="font-bold text-slate-800">Kechki ta'lim shakli (barcha yo'nalishlar)</span>
                      <span className="font-extrabold text-[#0c1f4a]">7 200 000 UZS / yil</span>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl p-4 text-xs flex gap-2.5">
                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" />
                    <p className="leading-normal font-medium">
                      Oliy ta'lim muassasalarida shartnoma mablag'larini to'lash semestrlarga bo'lingan holda amalga oshirilishi mumkin. Batafsil ma'lumot buxgalteriya bo'limidan olinadi.
                    </p>
                  </div>
                </div>
              )}

              {/* B. Mandat natijalari checking form */}
              {activeInfoModal === 'mandate' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#0c1f4a]/5 text-[#0c1f4a] rounded-2xl">
                      <CheckCircle2 className="w-6.5 h-6.5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{trans.cardMandateTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    Abituriyent ID yoki Pasport raqamini kiriting. (Simulyatsiya qilish uchun pasport seriyasini 'A' harfi bilan kiriting, masalan: <i>AA1234567</i> - Grant, yoki istalgan boshqa simulyatsiya - Kontrakt)
                  </p>
                  
                  <form onSubmit={handleCheckMandate} className="space-y-4">
                    <div className="flex gap-2.5">
                      <input 
                        type="text" 
                        placeholder="Masalan: AB1234567" 
                        value={mandatePassport}
                        onChange={(e) => setMandatePassport(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] flex-1 uppercase font-mono font-bold"
                      />
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-[#0c1f4a] hover:bg-[#0c1f4a]/90 text-white font-bold rounded-xl text-sm transition"
                      >
                        Tekshirish
                      </button>
                    </div>
                  </form>

                  {mandateResult && (
                    <div className={`p-5 rounded-2xl border ${mandateResult.status === 'recommended' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-blue-50/50 border-blue-100 text-blue-800'} space-y-2 animate-in fade-in duration-300`}>
                      <h4 className="font-extrabold text-sm uppercase tracking-wider">
                        Natija:
                      </h4>
                      <p className="text-sm font-bold leading-relaxed">
                        {mandateResult.text}
                      </p>
                      <div className="text-xs font-semibold pt-2 border-t border-current/10 flex justify-between">
                        <span>Yo'nalish: <b>{mandateResult.direction}</b></span>
                        <span>To'plangan ball: <b>{mandateResult.score}</b></span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* C. O'qishni ko'chirish info */}
              {activeInfoModal === 'transfer' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#0c1f4a]/5 text-[#0c1f4a] rounded-2xl">
                      <ArrowLeftRight className="w-6.5 h-6.5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{trans.cardTransferTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    O'qishni ko'chirish (perevod) jarayoni har yili yozgi va qishki ta'til davrida faqat Oliy ta'lim vazirligi tomonidan belgilangan muddatlarda amalga oshiriladi.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asosiy bosqichlar:</h4>
                    <div className="relative border-l border-slate-100 ml-2.5 pl-6 space-y-4.5 text-sm text-slate-600">
                      <div className="relative">
                        <div className="absolute -left-9 top-0.5 bg-[#0c1f4a] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">1</div>
                        <h5 className="font-bold text-slate-800">Ariza topshirish</h5>
                        <p className="text-xs text-slate-500 mt-0.5">transfer.edu.uz portali orqali onlayn ariza yuboriladi.</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-9 top-0.5 bg-[#0c1f4a] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">2</div>
                        <h5 className="font-bold text-slate-800">Hujjatlarni o'rganish</h5>
                        <p className="text-xs text-slate-500 mt-0.5">Vazirlik komissiyasi tomonidan arizalar 15 ish kuni ichida ko'rib chiqiladi.</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-9 top-0.5 bg-[#0c1f4a] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">3</div>
                        <h5 className="font-bold text-slate-800">Natijani e'lon qilish</h5>
                        <p className="text-xs text-slate-500 mt-0.5">Arizaning rad etilganligi yoki buyruq loyihasi portalda ko'rsatiladi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  onClick={() => {
                    setActiveInfoModal(null);
                    setMandatePassport('');
                    setMandateResult(null);
                  }}
                  className="px-5 py-2 bg-slate-100 hover:bg-[#0c1f4a] hover:text-white text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Yopish
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
