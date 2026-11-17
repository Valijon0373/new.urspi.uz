import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight, ArrowLeft, Calendar, FileText, Download,
  Eye, BookOpen, AlertCircle, RefreshCw, FileCheck, Layers
} from 'lucide-react';
import { menuLandingAPI, getFileUrl, onMenuHierarchyChange } from '../../api';

export default function InfoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [info, setInfo] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [materialsData, setMaterialsData] = useState({
    content: [],
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 1
  });
  const [materialsPage, setMaterialsPage] = useState(0);

  const currentLang = (i18n.language || 'uz').split('-')[0].toLowerCase();

  // 1. Info ma'lumotlarini va yillarni olish
  useEffect(() => {
    let isMounted = true;
    const fetchInfo = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const infoRes = await menuLandingAPI.getInfoDetail(id, currentLang);
        if (!isMounted) return;
        setInfo(infoRes);

        const fetchedYears = Array.isArray(infoRes.years) ? infoRes.years : [];
        setYears(fetchedYears);

        // Birinchi eng yangi yilni tanlaymiz (yoki null agar yillar bo'sh bo'lsa)
        if (fetchedYears.length > 0) {
          setSelectedYear(fetchedYears[0]);
        } else {
          setSelectedYear(null);
        }

        // SubCategory ma'lumotini olish (breadcrumb va orqaga tugmasi uchun)
        if (infoRes.subCategoryId) {
          try {
            const subRes = await menuLandingAPI.getSubCategoryById(infoRes.subCategoryId, currentLang);
            if (isMounted) setSubCategory(subRes);
          } catch (e) {
            // subcategory fetch optional
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('Info detail fetch error:', err.message);
        setError(err.message || 'Ma\'lumotlarni yuklaşda xatolik yuz berdi');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInfo();
    const unsub = onMenuHierarchyChange(() => fetchInfo());
    return () => {
      isMounted = false;
      unsub();
    };
  }, [id, currentLang]);

  // 2. Tanlangan yil bo'yicha materiallarni olish
  useEffect(() => {
    let isMounted = true;
    const fetchMaterials = async () => {
      if (!id || loading) return;
      setMaterialsLoading(true);
      try {
        const res = await menuLandingAPI.getInfoMaterials(id, {
          year: selectedYear,
          page: materialsPage,
          size: 20,
          lang: currentLang
        });
        if (isMounted) {
          setMaterialsData(res);
        }
      } catch (err) {
        console.warn('Materials fetch error:', err.message);
      } finally {
        if (isMounted) setMaterialsLoading(false);
      }
    };

    fetchMaterials();
    return () => {
      isMounted = false;
    };
  }, [id, selectedYear, materialsPage, currentLang, loading]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setMaterialsPage(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const photoUrl = info?.photoLink ? getFileUrl(info.photoLink) : null;
  const subCategoryTitle = subCategory?.name || 'Röyxat';

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* ── Header Banner & Breadcrumb ── */}
      <div className="w-full bg-[#0c1f4a] py-7 md:py-9 border-b border-white/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs sm:text-sm text-white/70 mb-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center flex-wrap gap-1 sm:gap-2">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('navbar.links.home') || 'Asosiy'}
                </Link>
              </li>
              {info?.subCategoryId && (
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                    <Link
                      to={`/subcategories/${info.subCategoryId}`}
                      className="hover:text-white transition-colors"
                    >
                      {subCategoryTitle}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                  <span className="text-white font-medium">{info?.title || 'Batafsil'}</span>
                </div>
              </li>
              {selectedYear && (
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                    <span className="text-sky-300 font-semibold">{selectedYear} yil</span>
                  </div>
                </li>
              )}
            </ol>
          </nav>

          {/* Title and Back Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {info?.subCategoryId && (
                  <button
                    onClick={() => navigate(`/subcategories/${info.subCategoryId}`)}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center shrink-0"
                    title="Orqaga"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {info?.title || 'Ma\'lumot'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1 md:ml-12">
                Yillar kesimidagi sonlar va materiallar
              </p>
            </div>

            {/* Quick Badge */}
            {years.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>{years.length} ta naşr yillari</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0c1f4a] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Jurnal ma'lumotlari yuklanmoqda...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Ma'lumot yuklanmadi</h3>
            <p className="text-sm text-red-600 mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Qayta uriniş
            </button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && info && (
          <div className="space-y-8">
            {/* 1. Info Card / Description (if photo or content exists) */}
            {(photoUrl || info.content) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                {photoUrl && (
                  <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={photoUrl}
                      alt={info.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {info.content && (
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Tavsif</h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {info.content}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 1.5 Attached Document / File Card */}
            {info.fileLink && (
              <div className="bg-white rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/50 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mb-1">
                      Biriktirilgan fayl / hujjat
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-800">
                      {info.fileName || info.title || 'Hujjat'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Uşbu yozuvga biriktirilgan rasmiy faylni körişingiz yoki yuklab olişingiz mumkin
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href={getFileUrl(info.fileLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Köriş</span>
                  </a>
                  <a
                    href={getFileUrl(info.fileLink)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1f4a] hover:bg-[#0a183d] text-white text-xs font-bold transition shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Yuklab oliş</span>
                  </a>
                </div>
              </div>
            )}

            {/* 2. Years Chips / Tabs */}
            {years.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0c1f4a]" />
                    <span>Naşr qilingan yillar</span>
                  </h3>
                  {selectedYear && (
                    <span className="text-xs text-slate-500 font-medium">
                      Tanlangan: <strong className="text-[#0c1f4a]">{selectedYear} yil</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-2 pt-1">
                  {/* Barçasi Chip */}
                  <button
                    onClick={() => handleYearChange(null)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      selectedYear === null
                        ? 'bg-[#0c1f4a] text-white shadow-md shadow-[#0c1f4a]/20 scale-[1.02]'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    <span>Barça yillar</span>
                  </button>

                  {/* Har bir yil uchun Chip (DESC tartibda) */}
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                        selectedYear === year
                          ? 'bg-[#0c1f4a] text-white shadow-md shadow-[#0c1f4a]/20 scale-[1.02]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                      }`}
                    >
                      <Calendar className={`w-3.5 h-3.5 ${selectedYear === year ? 'text-sky-300' : 'text-slate-400'}`} />
                      <span>{year}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* 3. Materials List / Grid */}
            {(years.length > 0 || materialsData.content.length > 0 || (!info.content && !info.photoLink && !info.fileLink)) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0c1f4a]" />
                    <span>
                      {selectedYear ? `${selectedYear} yilgi sonlar va maqolalar` : 'Barça materiallar'}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Jami: <strong className="text-slate-700">{materialsData.totalElements}</strong> ta son
                  </span>
                </div>

                {materialsLoading ? (
                  <div className="py-16 text-center text-slate-500">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-[#0c1f4a] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs font-medium">Materiallar yuklanmoqda...</p>
                  </div>
                ) : materialsData.content.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {materialsData.content.map((material) => {
                      const fileUrl = material.fileLink ? getFileUrl(material.fileLink) : '';
                      const coverUrl = material.coverLink ? getFileUrl(material.coverLink) : '';

                      return (
                        <div
                          key={material.id}
                          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
                        >
                          {/* Cover Image / Thumbnail */}
                          <div className="relative h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shrink-0 flex items-center justify-center border-b border-slate-100">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={material.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[#0c1f4a] transition">
                                <FileCheck className="w-14 h-14 mb-1 text-[#0c1f4a]/30 group-hover:text-[#0c1f4a]/60 transition" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">PDF NAŞR</span>
                              </div>
                            )}

                            {/* Year Badge */}
                            {material.year && (
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0c1f4a]/90 backdrop-blur-md text-white font-bold text-xs shadow-md">
                                {material.year}
                              </div>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-5 flex flex-col flex-1">
                            <h4
                              className="font-bold text-slate-800 text-sm md:text-base leading-snug group-hover:text-[#0c1f4a] transition line-clamp-2 mb-2"
                              title={material.title}
                            >
                              {material.title || `${material.year || ''} soni`}
                            </h4>

                            {(material.publishedAt || material.createdAt) && (
                              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(material.publishedAt || material.createdAt)}</span>
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-slate-100 mt-auto flex items-center gap-2">
                              {fileUrl ? (
                                <>
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0c1f4a] text-white text-xs font-semibold hover:bg-[#0a183d] transition shadow-sm"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Köriş</span>
                                  </a>
                                  <a
                                    href={fileUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-xs font-semibold flex items-center justify-center"
                                    title="Yuklab oliş"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              ) : (
                                <button
                                  disabled
                                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed text-center"
                                >
                                  Fayl biriktirilmagan
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium">
                      {selectedYear
                        ? `${selectedYear} yil uçun sonlar yoki materiallar mavjud emas`
                        : 'Hozirça materiallar mavjud emas'}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {materialsData.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <button
                      onClick={() => setMaterialsPage(p => Math.max(0, p - 1))}
                      disabled={materialsPage === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 transition"
                    >
                      Oldingi
                    </button>
                    <span className="text-xs text-slate-500 font-medium px-2">
                      {materialsPage + 1} / {materialsData.totalPages}
                    </span>
                    <button
                      onClick={() => setMaterialsPage(p => Math.min(materialsData.totalPages - 1, p + 1))}
                      disabled={materialsPage >= materialsData.totalPages - 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 transition"
                    >
                      Keyingi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

