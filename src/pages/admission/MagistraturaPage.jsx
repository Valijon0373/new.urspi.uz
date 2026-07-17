import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Layers, 
  UserCheck, 
  CalendarRange, 
  TrendingUp, 
  RefreshCw, 
  Eye, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Info,
  X,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const localTranslations = {
  uz: {
    breadcrumbHome: "Bosh sahifa",
    breadcrumbAdmission: "Abituriyent",
    breadcrumbCurrent: "Magistratura",
    
    mainTitle: "Qabul va Mandatlar",
    mainSubtitle: "Fanlar bo'yicha yillar kesimida qabul va mavjud mandatlar to'g'risida ma'lumotlar. Magistratura bosqichi uchun dolzarb statistikalar va hujjatlar.",
    
    // Stats
    statDirections: "Jami yo'nalishlar",
    statDirectionsVal: "12 yo'nalish",
    statQuota: "Jami qabul kvotasi",
    statQuotaVal: "450 talaba",
    statMandate: "Mavjud mandatlar",
    statMandateVal: "84 bo'sh o'rin",
    statAverage: "O'rtacha to'ldirish",
    statAverageVal: "82.5 foiz",

    // Sidebar
    sidebarTitle: "MUTAXASSISLIKLAR",
    sidebarHelpText: "Yo'nalishni tanlang va yillar kesimida mandatlar sonini ko'ring.",
    cardOnlineApplyTitle: "Onlayn Ariza",
    cardOnlineApplyDesc: "Magistraturaga hujjat topshirish endi yanada osonroq.",
    btnApply: "Topshirish",

    // Table Column
    colNo: "№",
    colPageName: "Sahifa nomi",
    colAction: "Amal",
    btnView: "Ko'rish",

    // Table Footer
    footerUpdated: "Ma'lumot yangilandi: 15.06.2024 14:30",
    footerHint: "Birinchi raqam - kvota, ikkinchi raqam - mandatlar.",

    // Specializations
    specs: {
      math: "Matematika va informatika",
      physics: "Fizika va texnologik ta'lim",
      philology: "Filologiya",
      primary: "Boshlang'ich ta'lim",
      history: "Tarix va ijtimoiy fanlar"
    },

    // Resources Names
    resQuota: "Qabul kvotasi",
    resResults: "Magistraturaga 2024/2025-o'quv yili bo'yicha tanlov natijalari qaydnomalari",
    resCertificates: "Til sertifikatlari ro'yxati",
    resCenter: "Magistratura bo'yicha maslahat markazi",
    resOnlineApply: "Magistraturaga onlayn ariza topshirish",
    resList: "Magistratura mutaxassisliklari ro'yxati",

    // Modal
    modalClose: "Yopish"
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbAdmission: "Абитуриент",
    breadcrumbCurrent: "Магистратура",
    
    mainTitle: "Прием и Мандаты",
    mainSubtitle: "Информация о приеме и мандатах по предметам и годам. Актуальная статистика и документы для магистратуры.",
    
    // Stats
    statDirections: "Всего направлений",
    statDirectionsVal: "12 направлений",
    statQuota: "Общая квота приема",
    statQuotaVal: "450 студентов",
    statMandate: "Доступные мандаты",
    statMandateVal: "84 свободных мест",
    statAverage: "Средняя заполняемость",
    statAverageVal: "82.5 процента",

    // Sidebar
    sidebarTitle: "СПЕЦИАЛЬНОСТИ",
    sidebarHelpText: "Выберите направление, чтобы увидеть количество мандатов по годам.",
    cardOnlineApplyTitle: "Онлайн-заявление",
    cardOnlineApplyDesc: "Подать документы в магистратуру стало еще проще.",
    btnApply: "Подать",

    // Table Column
    colNo: "№",
    colPageName: "Название страницы",
    colAction: "Действие",
    btnView: "Смотреть",

    // Table Footer
    footerUpdated: "Информация обновлена: 15.06.2024 14:30",
    footerHint: "Первая цифра - квота, вторая цифра - мандаты.",

    // Specializations
    specs: {
      math: "Математика и информатика",
      physics: "Физика и технологическое образование",
      philology: "Филология",
      primary: "Начальное образование",
      history: "История и социальные науки"
    },

    // Resources Names
    resQuota: "Квота приема",
    resResults: "Ведомости результатов конкурса в магистратуру на 2024/2025 учебный год",
    resCertificates: "Список языковых сертификатов",
    resCenter: "Консультационный центр по магистратуре",
    resOnlineApply: "Подача онлайн-заявления в магистратуру",
    resList: "Список специальностей магистратуры",

    // Modal
    modalClose: "Закрыть"
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbAdmission: "Admission",
    breadcrumbCurrent: "Master's Degree",
    
    mainTitle: "Admission and Mandates",
    mainSubtitle: "Information on admissions and available mandates by subjects and years. Current statistics and documents for the Master's level.",
    
    // Stats
    statDirections: "Total directions",
    statDirectionsVal: "12 directions",
    statQuota: "Total admission quota",
    statQuotaVal: "450 students",
    statMandate: "Available mandates",
    statMandateVal: "84 vacant slots",
    statAverage: "Average filling rate",
    statAverageVal: "82.5 percent",

    // Sidebar
    sidebarTitle: "SPECIALIZATIONS",
    sidebarHelpText: "Select a direction to view the number of mandates across academic years.",
    cardOnlineApplyTitle: "Online Application",
    cardOnlineApplyDesc: "Applying for the Master's program is now even easier.",
    btnApply: "Apply",

    // Table Column
    colNo: "№",
    colPageName: "Page Title",
    colAction: "Action",
    btnView: "View",

    // Table Footer
    footerUpdated: "Data updated: 15.06.2024 14:30",
    footerHint: "First number - quota, second number - mandates.",

    // Specializations
    specs: {
      math: "Mathematics and Computer Science",
      physics: "Physics and Technological Education",
      philology: "Philology",
      primary: "Primary Education",
      history: "History and Social Sciences"
    },

    // Resources Names
    resQuota: "Admission Quota",
    resResults: "Evaluation registers for Master's admission in the 2024/2025 academic year",
    resCertificates: "List of accepted language certificates",
    resCenter: "Consultation Center for Master's programs",
    resOnlineApply: "Submit online application for Master's programs",
    resList: "List of Master's specializations",

    // Modal
    modalClose: "Close"
  }
};

const quotaDetailsMock = {
  math: { quota: 20, mandate: 18, grantQuota: 5, contractQuota: 15, grantMinScore: 165.2, contractMinScore: 110.5 },
  physics: { quota: 15, mandate: 12, grantQuota: 3, contractQuota: 12, grantMinScore: 158.4, contractMinScore: 98.6 },
  philology: { quota: 25, mandate: 22, grantQuota: 6, contractQuota: 19, grantMinScore: 172.1, contractMinScore: 118.2 },
  primary: { quota: 30, mandate: 28, grantQuota: 8, contractQuota: 22, grantMinScore: 160.8, contractMinScore: 104.4 },
  history: { quota: 18, mandate: 15, grantQuota: 4, contractQuota: 14, grantMinScore: 168.9, contractMinScore: 112.7 }
};

export default function MagistraturaPage() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'uz';
  const trans = localTranslations[currentLang] || localTranslations.uz;

  // States
  const [selectedYear, setSelectedYear] = useState('2026/2027');
  const [selectedLevel, setSelectedLevel] = useState('magistratura');
  const [selectedSpec, setSelectedSpec] = useState('math'); // 'math', 'physics', 'philology', 'primary', 'history'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState(null); // Row object or ID to preview

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const specializations = [
    { key: 'math', label: trans.specs.math },
    { key: 'physics', label: trans.specs.physics },
    { key: 'philology', label: trans.specs.philology },
    { key: 'primary', label: trans.specs.primary },
    { key: 'history', label: trans.specs.history }
  ];

  // Year offset configurations for Magistratura
  const yearOffsets = {
    '2026/2027': { quotaMul: 1.15, scoreAdd: 2.2, directionsCount: 14, quotaCount: 520, mandateCount: 96, averageVal: '84.2' },
    '2025/2026': { quotaMul: 1.05, scoreAdd: 1.1, directionsCount: 13, quotaCount: 480, mandateCount: 90, averageVal: '83.1' },
    '2024/2025': { quotaMul: 1.0, scoreAdd: 0.0, directionsCount: 12, quotaCount: 450, mandateCount: 84, averageVal: '82.5' },
    '2023/2024': { quotaMul: 0.9, scoreAdd: -2.0, directionsCount: 11, quotaCount: 410, mandateCount: 75, averageVal: '80.8' },
  };

  const currentOffset = yearOffsets[selectedYear] || yearOffsets['2026/2027'];

  const getDynamicStat = (val, originalNumber, newNumber) => {
    return val.replace(String(originalNumber), String(newNumber));
  };

  const resources = [
    { id: 1, name: trans.resQuota },
    { id: 2, name: trans.resResults.replace('2024/2025', selectedYear) },
    { id: 3, name: trans.resCertificates },
    { id: 4, name: trans.resCenter },
    { id: 5, name: trans.resOnlineApply },
    { id: 6, name: trans.resList }
  ];

  const baseQuotaData = quotaDetailsMock[selectedSpec] || quotaDetailsMock.math;
  const currentQuotaData = {
    ...baseQuotaData,
    quota: Math.round(baseQuotaData.quota * currentOffset.quotaMul),
    grantQuota: baseQuotaData.grantQuota > 0 ? Math.round(baseQuotaData.grantQuota * currentOffset.quotaMul) : 0,
    contractQuota: Math.round(baseQuotaData.quota * currentOffset.quotaMul) - (baseQuotaData.grantQuota > 0 ? Math.round(baseQuotaData.grantQuota * currentOffset.quotaMul) : 0),
    grantMinScore: typeof baseQuotaData.grantMinScore === 'number' ? parseFloat((baseQuotaData.grantMinScore + currentOffset.scoreAdd).toFixed(1)) : baseQuotaData.grantMinScore,
    contractMinScore: typeof baseQuotaData.contractMinScore === 'number' ? parseFloat((baseQuotaData.contractMinScore + currentOffset.scoreAdd).toFixed(1)) : baseQuotaData.contractMinScore,
    mandate: Math.round(baseQuotaData.mandate * currentOffset.quotaMul)
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
        
        {/* ── 2. PAGE HEADER WITH DROPDOWNS ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#0c1f4a] tracking-tight">{trans.mainTitle}</h1>
            <p className="text-sm text-slate-500 max-w-3xl mt-2 leading-relaxed">
              {trans.mainSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            {/* Year selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] transition cursor-pointer shadow-sm"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            {/* Level selector */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="appearance-none bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/10 focus:border-[#0c1f4a] transition cursor-pointer shadow-sm"
              >
                <option value="magistratura">{trans.breadcrumbCurrent}</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. FOUR INLINE STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Jami yo'nalishlar */}
          <div className="bg-sky-55/40 border border-[#0c1f4a]/10 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition shadow-sm">
            <div className="p-3 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{trans.statDirections}</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {getDynamicStat(trans.statDirectionsVal, 12, currentOffset.directionsCount)}
              </div>
            </div>
          </div>

          {/* Card 2: Jami qabul kvotasi */}
          <div className="bg-sky-55/40 border border-[#0c1f4a]/10 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition shadow-sm">
            <div className="p-3 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{trans.statQuota}</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {getDynamicStat(trans.statQuotaVal, 450, currentOffset.quotaCount)}
              </div>
            </div>
          </div>

          {/* Card 3: Mavjud mandatlar */}
          <div className="bg-sky-55/40 border border-[#0c1f4a]/10 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition shadow-sm">
            <div className="p-3 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{trans.statMandate}</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {getDynamicStat(trans.statMandateVal, 84, currentOffset.mandateCount)}
              </div>
            </div>
          </div>

          {/* Card 4: O'rtacha to'ldirish */}
          <div className="bg-sky-55/40 border border-[#0c1f4a]/10 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition shadow-sm">
            <div className="p-3 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{trans.statAverage}</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {getDynamicStat(trans.statAverageVal, '82.5', currentOffset.averageVal)}
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. TWO-COLUMN SPLIT LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Sidebar + Ariza) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Specialization sidebar menu */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#0c1f4a] px-5 py-4 text-white text-xs font-extrabold tracking-wider uppercase">
                {trans.sidebarTitle}
              </div>
              <ul className="divide-y divide-slate-100 flex-grow">
                {specializations.map((spec) => (
                  <li key={spec.key}>
                    <button
                      onClick={() => setSelectedSpec(spec.key)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold transition-all border-l-4 ${selectedSpec === spec.key ? 'bg-slate-50 border-[#0c1f4a] text-[#0c1f4a]' : 'border-transparent text-slate-700 hover:bg-slate-50/55'}`}
                    >
                      <span className="line-clamp-2 pr-2">{spec.label}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedSpec === spec.key ? 'translate-x-1' : 'opacity-40'}`} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-5 bg-sky-50/40 border-t border-slate-100 text-xs text-slate-500 font-semibold flex gap-2.5">
                <Info className="w-4 h-4 text-[#0c1f4a] shrink-0 mt-0.5" />
                <p className="leading-normal">{trans.sidebarHelpText}</p>
              </div>
            </div>

            {/* Online application call-to-action block */}
            <div className="bg-[#0c1f4a] rounded-2xl p-6 text-white relative overflow-hidden group shadow-[0_10px_20px_rgba(12,31,74,0.15)] flex flex-col justify-between min-h-[220px]">
              <div className="absolute -right-6 -bottom-6 opacity-[0.04] text-white group-hover:scale-110 transition duration-500">
                <FileText className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black">{trans.cardOnlineApplyTitle}</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-semibold">
                  {trans.cardOnlineApplyDesc}
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <a 
                  href="https://my.edu.uz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white hover:bg-slate-100 text-[#0c1f4a] font-extrabold rounded-xl text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>{trans.btnApply}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (Admission info table) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full justify-between">
              
              <div>
                {/* Header */}
                <div className="p-5 md:p-6 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 text-lg font-black leading-snug">
                      {specializations.find(s => s.key === selectedSpec)?.label} {trans.breadcrumbCurrent} Qabuli {selectedYear}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">
                      Joriy o'quv yili uchun rasmiy ma'lumotlar va natijalar
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className={`p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition border border-slate-100 ${isRefreshing ? 'animate-spin text-[#0c1f4a]' : ''}`}
                    title="Yangilash"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-sky-50/30 text-[#0c1f4a] font-extrabold text-[11px] uppercase tracking-wider">
                        <th className="px-5 py-4 w-12 text-center">{trans.colNo}</th>
                        <th className="px-5 py-4">{trans.colPageName}</th>
                        <th className="px-5 py-4 text-center w-24">{trans.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {resources.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-5 py-4 text-center font-bold text-slate-400">{res.id}</td>
                          <td className="px-5 py-4 font-bold text-slate-800 leading-snug">
                            {res.name}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => setActivePreviewDoc(res)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0c1f4a] hover:text-white text-[#0c1f4a] font-bold rounded-lg text-[11px] transition duration-200 border border-slate-100 shadow-sm"
                            >
                              <span>{trans.btnView}</span>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Footer */}
              <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-semibold">
                <div>{trans.footerUpdated}</div>
                <div className="text-slate-500 font-bold">{trans.footerHint}</div>
              </div>

            </div>
          </div>

        </div>

        {/* ── 5. BOTTOM INFO BLOCKS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Call-Center */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3.5 bg-slate-50 text-[#0c1f4a] rounded-xl shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[#0c1f4a] text-sm font-black uppercase tracking-wider">Call-Center</h4>
              <div className="mt-3 space-y-1 text-sm font-extrabold text-slate-800">
                <a href="tel:+998622293787" className="block hover:text-[#0c1f4a] transition">+998 62 229 37 87</a>
                <a href="tel:+998622291477" className="block hover:text-[#0c1f4a] transition">+998 62 229 14 77</a>
              </div>
            </div>
          </div>

          {/* Box 2: Manzil */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="p-3.5 bg-slate-50 text-[#0c1f4a] rounded-xl shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[#0c1f4a] text-sm font-black uppercase tracking-wider">Manzil</h4>
              <p className="text-sm font-bold text-slate-800 mt-2">
                Urganch shahri, Gurlan ko'chasi, 1-A uy
              </p>
              <div className="mt-1 text-xs text-slate-400 font-semibold">
                Avtobus: 7, 18, 19
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── 6. DOCUMENT PREVIEW DIALOG MODAL ── */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0c1f4a] p-5 text-white relative flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-white/70">Hujjat ko'rinishi</h3>
                <h4 className="text-base font-black leading-snug mt-0.5">{activePreviewDoc.name}</h4>
              </div>
              <button 
                onClick={() => setActivePreviewDoc(null)}
                className="absolute top-5 right-5 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content body based on document id */}
            <div className="p-6 md:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              
              {/* Id 1: Qabul kvotasi details */}
              {activePreviewDoc.id === 1 && (
                <div className="space-y-4 text-sm">
                  <p className="text-slate-500 font-medium">
                    Tashkil etilgan qabul yili ({selectedYear}) bo'yicha mutaxassislik kvotalari taqsimoti:
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="font-bold text-slate-800">Tanlangan yo'nalish:</span>
                      <span className="font-extrabold text-[#0c1f4a]">{specializations.find(s => s.key === selectedSpec)?.label}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="font-bold text-slate-800">Umumiy kvota:</span>
                      <span className="font-black text-slate-900">{currentQuotaData.quota} ta o'rin</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="font-bold text-slate-800">Davlat Granti:</span>
                      <span className="font-extrabold text-emerald-600">{currentQuotaData.grantQuota} ta o'rin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-800">To'lov-kontrakt:</span>
                      <span className="font-extrabold text-slate-700">{currentQuotaData.contractQuota} ta o'rin</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Id 2: Tanlov natijalari qaydnomalari */}
              {activePreviewDoc.id === 2 && (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm font-medium">
                    Ushbu yo'nalish bo'yicha e'lon qilingan test/imtihon natijalari qaydnomasi:
                  </p>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-100">
                          <th className="px-4 py-2.5 text-center">F.I.SH</th>
                          <th className="px-4 py-2.5 text-center">Ball</th>
                          <th className="px-4 py-2.5 text-center">Holat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        <tr className="bg-emerald-50/20">
                          <td className="px-4 py-3">Omonov Dilmurod B.</td>
                          <td className="px-4 py-3 text-center font-bold">182.4</td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-extrabold">Grant</td>
                        </tr>
                        <tr className="bg-emerald-50/20">
                          <td className="px-4 py-3">Karimova Shahlo T.</td>
                          <td className="px-4 py-3 text-center font-bold">171.5</td>
                          <td className="px-4 py-3 text-center text-emerald-600 font-extrabold">Grant</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Salayev Nodirbek G.</td>
                          <td className="px-4 py-3 text-center font-bold">155.0</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-extrabold">Kontrakt</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Jumaniyazova Barno R.</td>
                          <td className="px-4 py-3 text-center font-bold">132.8</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-extrabold">Kontrakt</td>
                        </tr>
                        <tr className="opacity-60 bg-red-50/10">
                          <td className="px-4 py-3">Bobojonov Farxod I.</td>
                          <td className="px-4 py-3 text-center font-bold">98.5</td>
                          <td className="px-4 py-3 text-center text-red-500 font-bold">Yiqildi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Id 3: Til sertifikatlari ro'yxati */}
              {activePreviewDoc.id === 3 && (
                <div className="space-y-4 text-sm text-slate-700">
                  <p className="text-slate-500 font-medium">
                    Magistraturaga hujjat topshirishda talab etiladigan milliy yoki xalqaro sertifikatlar ro'yxati va minimal talab darajasi:
                  </p>
                  <ul className="space-y-2.5 bg-slate-50 rounded-2xl p-4">
                    <li className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Ingliz tili (IELTS)</span>
                      <span className="font-black text-[#0c1f4a]">5.5 yoki undan yuqori</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Ingliz tili (CEFR / Milliy sertifikat)</span>
                      <span className="font-black text-[#0c1f4a]">B2 yoki undan yuqori</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Rus tili (TRKI)</span>
                      <span className="font-black text-[#0c1f4a]">B2 yoki undan yuqori</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Nemis tili (Goethe-Zertifikat)</span>
                      <span className="font-black text-[#0c1f4a]">B2 / TestDaF (TDN 3)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-bold">Fransuz tili (DELF / DALF)</span>
                      <span className="font-black text-[#0c1f4a]">B2 yoki undan yuqori</span>
                    </li>
                  </ul>
                  <div className="bg-amber-50 text-amber-800 p-4 border border-amber-100 rounded-2xl text-xs flex gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-700" />
                    <p className="leading-normal font-semibold">
                      Muhim! Magistratura mutaxassisliklariga qabul qilinish uchun chet tili sertifikati bo'lishi majburiy hisoblanadi. Sertifikatga ega bo'lmagan abituriyentlar ro'yxatdan o'ta olmaydi.
                    </p>
                  </div>
                </div>
              )}

              {/* Id 4: Maslahat markazi */}
              {activePreviewDoc.id === 4 && (
                <div className="space-y-4 text-sm text-slate-700">
                  <p className="text-slate-500 font-medium">
                    Abituriyentlar va ularning ota-onalari uchun qabul davrida faoliyat yurituvchi maslahat markazi:
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3.5">
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Ish tartibi:</span>
                      <span className="font-extrabold text-[#0c1f4a]">Dushanba - Shanba, 9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Tushlik vaqti:</span>
                      <span className="font-extrabold text-slate-600">13:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-2">
                      <span className="font-bold">Mas'ul xodim:</span>
                      <span className="font-extrabold text-slate-800">Qabul komissiyasi kotibi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Telegram kanal:</span>
                      <a href="#" className="font-extrabold text-blue-600 hover:underline">@urspi_qabul</a>
                    </div>
                  </div>
                </div>
              )}

              {/* Id 5: Onlayn ariza topshirish */}
              {activePreviewDoc.id === 5 && (
                <div className="space-y-4 text-sm text-slate-700">
                  <p className="text-slate-500 font-medium">
                    Hujjat topshirish tartibi va bosqichlari:
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div className="h-6 w-6 rounded-full bg-[#0c1f4a] text-white flex items-center justify-center text-xs font-black shrink-0">1</div>
                      <p className="font-semibold text-slate-700">
                        <b>magistr.edu.uz</b> portalida ro'yxatdan o'ting.
                      </p>
                    </div>
                    <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div className="h-6 w-6 rounded-full bg-[#0c1f4a] text-white flex items-center justify-center text-xs font-black shrink-0">2</div>
                      <p className="font-semibold text-slate-700">
                        Shaxsiy ma'lumotlar va bakalavr diplomi ma'lumotlarini kiriting.
                      </p>
                    </div>
                    <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div className="h-6 w-6 rounded-full bg-[#0c1f4a] text-white flex items-center justify-center text-xs font-black shrink-0">3</div>
                      <p className="font-semibold text-slate-700">
                        Amaldagi chet tili sertifikati ma'lumotlarini biriktiring.
                      </p>
                    </div>
                    <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl">
                      <div className="h-6 w-6 rounded-full bg-[#0c1f4a] text-white flex items-center justify-center text-xs font-black shrink-0">4</div>
                      <p className="font-semibold text-slate-700">
                        Urganch davlat pedagogika institutini hamda mutaxassislikni tanlab, arizani yakunlang.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Id 6: Mutaxassisliklar ro'yxati */}
              {activePreviewDoc.id === 6 && (
                <div className="space-y-4 text-sm text-slate-700">
                  <p className="text-slate-500 font-medium">
                    Institutimizda mavjud barcha magistratura mutaxassisliklari ro'yxati:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 rounded-2xl p-4 font-semibold text-xs text-slate-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{trans.specs.math}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{trans.specs.physics}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{trans.specs.philology}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{trans.specs.primary}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{trans.specs.history}</span>
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Kimyo mutaxassisligi</span>
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Biologiya mutaxassisligi</span>
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Musiqa ta'limi</span>
                    </li>
                  </ul>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="px-6 py-2 bg-[#0c1f4a] hover:bg-[#0c1f4a]/90 text-white font-extrabold rounded-xl text-xs transition uppercase tracking-wider"
              >
                {trans.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
