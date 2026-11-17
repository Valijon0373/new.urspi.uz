import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, ChevronDown, ChevronUp, Users, BarChart3, RefreshCw, CheckCircle2 } from 'lucide-react';
import { FaBookOpenReader, FaVenus, FaMars } from 'react-icons/fa6';
import { PiStudentFill, PiUsers } from 'react-icons/pi';
import { IoBarChartOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { hemisAPI } from '../../../api';
import main from '../../../assets/images/main.jpg';
import main2 from '../../../assets/images/main2.jpg';

export default function Statistics() {
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = [main, main2];

  // HEMIS Public Stats state
  const [hemisData, setHemisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('region');

  // Background slider effect
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch student statistics when component mounts or language changes
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const res = await hemisAPI.getPublicStudentStats(i18n.language);
        if (!isMounted) return;

        // Extract data resiliently
        const payload = res?.data?.data || res?.data || res;
        if (payload && (payload.education_type || payload.region || payload.payment)) {
          setHemisData(payload);
        } else {
          // If HEMIS backend not active or empty
          setHemisData(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('HEMIS public stats error:', err.message);
        setHasError(true);
        setHemisData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  // Derived calculations
  const educationType = hemisData?.education_type || {};
  const jamiObj = educationType?.Jami || educationType?.jami || null;
  const bakalavrObj = educationType?.Bakalavr || educationType?.bakalavr || null;
  const magistrObj = educationType?.Magistr || educationType?.magistr || null;

  const totalStudentsCount = useMemo(() => {
    if (jamiObj) {
      const e = Number(jamiObj.Erkak || jamiObj.erkak || 0);
      const a = Number(jamiObj.Ayol || jamiObj.ayol || 0);
      if (e + a > 0) return e + a;
      if (jamiObj.Jami || jamiObj.jami) return Number(jamiObj.Jami || jamiObj.jami);
    }
    return 8317; // fallback
  }, [jamiObj]);

  const totalMale = jamiObj ? Number(jamiObj.Erkak || jamiObj.erkak || 0) : null;
  const totalFemale = jamiObj ? Number(jamiObj.Ayol || jamiObj.ayol || 0) : null;

  // Category labels based on language
  const currentLang = (i18n.language || 'uz').toLowerCase();
  const CATEGORY_NAMES = {
    region: currentLang.startsWith('ru') ? 'Регионы' : currentLang.startsWith('en') ? 'Regions' : 'Hududlar kesimida',
    payment: currentLang.startsWith('ru') ? 'Форма оплаты' : currentLang.startsWith('en') ? 'Payment Type' : "Tölov şakli",
    education_form: currentLang.startsWith('ru') ? 'Форма обучения' : currentLang.startsWith('en') ? 'Education Form' : "Ta'lim şakli",
    level: currentLang.startsWith('ru') ? 'Курсы' : currentLang.startsWith('en') ? 'Course Levels' : 'Kurslar kesimida',
    age: currentLang.startsWith('ru') ? 'Возраст' : currentLang.startsWith('en') ? 'Age Groups' : 'Yoş toifalari',
    citizenship: currentLang.startsWith('ru') ? 'Гражданство' : currentLang.startsWith('en') ? 'Citizenship' : 'Fuqarolik',
    accommodation: currentLang.startsWith('ru') ? 'Проживание' : currentLang.startsWith('en') ? 'Accommodation' : 'Turar joyi',
  };

  // Safe parser for dynamic nested objects
  const parseEntry = (val) => {
    if (typeof val === 'number') {
      return { total: val, erkak: 0, ayol: 0 };
    }
    if (typeof val === 'object' && val !== null) {
      const erkak = Number(val.Erkak ?? val.erkak ?? val.male ?? 0);
      const ayol = Number(val.Ayol ?? val.ayol ?? val.female ?? 0);
      const jami = Number(val.Jami ?? val.jami ?? val.total ?? (erkak + ayol));
      return { total: jami, erkak, ayol };
    }
    return { total: 0, erkak: 0, ayol: 0 };
  };

  // Get entries for current active dynamic category
  const activeEntries = useMemo(() => {
    if (!hemisData || !hemisData[activeCategory]) return [];
    const raw = hemisData[activeCategory];
    if (typeof raw !== 'object' || raw === null) return [];
    return Object.entries(raw).map(([key, val]) => {
      const parsed = parseEntry(val);
      return {
        key,
        ...parsed,
      };
    });
  }, [hemisData, activeCategory]);

  const maxCategoryTotal = useMemo(() => {
    if (!activeEntries.length) return 1;
    return Math.max(...activeEntries.map((e) => e.total), 1);
  }, [activeEntries]);

  // Available categories in returned data
  const availableCategories = useMemo(() => {
    if (!hemisData) return [];
    return ['region', 'payment', 'education_form', 'level', 'age', 'citizenship', 'accommodation'].filter(
      (cat) => hemisData[cat] && Object.keys(hemisData[cat]).length > 0
    );
  }, [hemisData]);

  const StatCard = ({ title, value, subtext, Icon, iconClassName, titleClassName, isLive }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md flex-1 relative overflow-hidden">
      {isLive && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          HEMIS
        </span>
      )}
      <div className="flex justify-between items-start mb-4 text-left">
        <p className={`text-[#0c1f4a] text-[15px] sm:text-base font-semibold pr-2 ${titleClassName || ''}`}>
          {title}
        </p>
        <Icon className={`text-blue-400 opacity-70 shrink-0 ${iconClassName || 'w-10 h-10'}`} strokeWidth={1.5} />
      </div>
      <div className="text-left mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-[#1d4ed8]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {loading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
        </div>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#f4f7f9] py-12 md:py-16 text-center" aria-labelledby="statistics-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <h2
            id="statistics-heading"
            className="flex items-center justify-center gap-3 md:gap-4 font-bold tracking-tight"
            style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}
          >
            -
            <IoBarChartOutline style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }} />
            {t('home.statistics.title')}
            -
          </h2>
          {hemisData && (
            <p className="text-xs sm:text-sm text-slate-500 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              HEMIS axborot tizimi orqali real vaqtda yangilanadi
            </p>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[340px]">
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <StatCard title={t('home.statistics.directions')} value="50" Icon={FaBookOpenReader} />
            <StatCard
              title={t('home.statistics.students')}
              value={totalStudentsCount}
              subtext={
                totalMale !== null && totalFemale !== null
                  ? `Erkak: ${totalMale.toLocaleString()} | Ayol: ${totalFemale.toLocaleString()}`
                  : null
              }
              Icon={PiUsers}
              isLive={Boolean(hemisData)}
            />
          </div>

          {/* Middle Column (Slider) */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm lg:col-span-2 min-h-[250px] lg:min-h-full">
            {bgImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === bgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img src={img} alt="Institut körinişi" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <StatCard title={t('home.statistics.professors')} value="325" Icon={PiStudentFill} />
            <StatCard title={t('home.statistics.science_potential')} value="67.6%" Icon={Briefcase} />
          </div>
        </div>

        {/* Detailed HEMIS Student Statistics Expandable Section */}
        {hemisData && (
          <div className="mt-8 transition-all duration-300">
            <button
              onClick={() => setShowDetailed(!showDetailed)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1d4ed8] font-semibold text-sm shadow-sm border border-slate-200 transition-all hover:shadow cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>
                {showDetailed ? "Batafsil statistikani yopiş" : "HEMIS batafsil talabalar statistikasi"}
              </span>
              {showDetailed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetailed && (
              <div className="mt-6 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 text-left animate-fade-in">
                {/* Education Type Overview (Bakalavr & Magistr) */}
                {(bakalavrObj || magistrObj) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]" />
                      Ta'lim bosqiçlari (Bakalavr va Magistratura)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bakalavr */}
                      {bakalavrObj && (
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-slate-800 text-base">Bakalavr</span>
                            <span className="text-xl font-bold text-[#1d4ed8]">
                              {(
                                Number(bakalavrObj.Erkak || 0) + Number(bakalavrObj.Ayol || 0)
                              ).toLocaleString()}{' '}
                              nafar
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-slate-600">
                              <span className="flex items-center gap-1 text-blue-600">
                                <FaMars className="w-3.5 h-3.5" /> Erkak: {Number(bakalavrObj.Erkak || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-pink-600">
                                <FaVenus className="w-3.5 h-3.5" /> Ayol: {Number(bakalavrObj.Ayol || 0).toLocaleString()}
                              </span>
                            </div>
                            {/* Gender split progress bar */}
                            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                              <div
                                style={{
                                  width: `${
                                    (Number(bakalavrObj.Erkak || 0) /
                                      Math.max(
                                        Number(bakalavrObj.Erkak || 0) + Number(bakalavrObj.Ayol || 0),
                                        1
                                      )) *
                                    100
                                  }%`,
                                }}
                                className="bg-blue-500 h-full"
                                title="Erkak"
                              />
                              <div
                                style={{
                                  width: `${
                                    (Number(bakalavrObj.Ayol || 0) /
                                      Math.max(
                                        Number(bakalavrObj.Erkak || 0) + Number(bakalavrObj.Ayol || 0),
                                        1
                                      )) *
                                    100
                                  }%`,
                                }}
                                className="bg-pink-500 h-full"
                                title="Ayol"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Magistr */}
                      {magistrObj && (
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-slate-800 text-base">Magistratura</span>
                            <span className="text-xl font-bold text-[#1d4ed8]">
                              {(
                                Number(magistrObj.Erkak || 0) + Number(magistrObj.Ayol || 0)
                              ).toLocaleString()}{' '}
                              nafar
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-slate-600">
                              <span className="flex items-center gap-1 text-blue-600">
                                <FaMars className="w-3.5 h-3.5" /> Erkak: {Number(magistrObj.Erkak || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-pink-600">
                                <FaVenus className="w-3.5 h-3.5" /> Ayol: {Number(magistrObj.Ayol || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                              <div
                                style={{
                                  width: `${
                                    (Number(magistrObj.Erkak || 0) /
                                      Math.max(
                                        Number(magistrObj.Erkak || 0) + Number(magistrObj.Ayol || 0),
                                        1
                                      )) *
                                    100
                                  }%`,
                                }}
                                className="bg-blue-500 h-full"
                                title="Erkak"
                              />
                              <div
                                style={{
                                  width: `${
                                    (Number(magistrObj.Ayol || 0) /
                                      Math.max(
                                        Number(magistrObj.Erkak || 0) + Number(magistrObj.Ayol || 0),
                                        1
                                      )) *
                                    100
                                  }%`,
                                }}
                                className="bg-pink-500 h-full"
                                title="Ayol"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Tabs */}
                {availableCategories.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100 mb-6">
                      {availableCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            activeCategory === cat
                              ? 'bg-[#1d4ed8] text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {CATEGORY_NAMES[cat] || cat}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Items Table / Progress List */}
                    <div className="space-y-3">
                      {activeEntries.length === 0 ? (
                        <p className="text-slate-400 text-sm py-4">Ma'lumotlar topilmadi</p>
                      ) : (
                        activeEntries.map((item, idx) => {
                          const percentage = Math.round((item.total / maxCategoryTotal) * 100);
                          return (
                            <div
                              key={idx}
                              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-100"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <span className="font-semibold text-slate-800 text-sm">
                                  {item.key}
                                </span>
                                <div className="flex items-center gap-3 text-xs">
                                  {item.erkak > 0 && (
                                    <span className="text-blue-600 font-medium flex items-center gap-1">
                                      <FaMars /> {item.erkak.toLocaleString()}
                                    </span>
                                  )}
                                  {item.ayol > 0 && (
                                    <span className="text-pink-600 font-medium flex items-center gap-1">
                                      <FaVenus /> {item.ayol.toLocaleString()}
                                    </span>
                                  )}
                                  <span className="font-bold text-[#1d4ed8] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                                    {item.total.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              {/* Visual progress bar */}
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${percentage}%` }}
                                  className="h-full bg-[#1d4ed8] rounded-full transition-all duration-500"
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
