import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight, ChevronLeft, Eye, ExternalLink, Calendar,
  Search, BookOpen, FileText, ArrowRight, RefreshCw, AlertCircle,
  Download, FileCheck
} from 'lucide-react';
import { menuLandingAPI, getFileUrl, onMenuHierarchyChange } from '../../api';

export default function SubCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    subCategory: null,
    contentType: 'TABLE',
    linkPath: null,
    linkTargetType: null,
    tableColumns: null,
    infos: [],
    totalElements: 0,
    totalPages: 1,
    number: 0,
    size: 20
  });

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLang = (i18n.language || 'uz').split('-')[0].toLowerCase();

  const fetchInfos = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await menuLandingAPI.getSubCategoryInfos(id, {
        page,
        size: 20,
        lang: currentLang
      });

      setData(res);

      // Agar LINK turida bo'lsa va linkPath mavjud bo'lsa
      if (res.contentType === 'LINK' && res.linkPath) {
        const link = res.linkPath.trim();
        if (link.startsWith('http://') || link.startsWith('https://')) {
          // Tashqi havola
        } else {
          // Ichki havola
        }
      }
    } catch (err) {
      console.warn('SubCategory infos fetch error:', err.message);
      setError(err.message || 'Ma\'lumotlarni yuklaşda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [id, currentLang]);

  useEffect(() => {
    fetchInfos();
    const unsub = onMenuHierarchyChange(() => fetchInfos());
    return () => unsub();
  }, [id, currentLang, page]);

  // Jadval ustunlari (subCategory.tableColumns JSON string bo'lishi mumkin)
  const columns = useMemo(() => {
    const raw = data.tableColumns || data.subCategory?.tableColumns;
    if (raw) {
      if (Array.isArray(raw)) return raw;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // oddiy matn bo'lsa
      }
    }
    return ['№', 'Sahifa nomi', 'Köriş'];
  }, [data.tableColumns, data.subCategory?.tableColumns]);

  // Qidiruv bo'yicha filtrlangan infos
  const filteredInfos = useMemo(() => {
    if (!searchQuery.trim()) return data.infos;
    const query = searchQuery.toLowerCase();
    return data.infos.filter(info => {
      const title = (info.title || '').toLowerCase();
      const content = (info.content || '').toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  }, [data.infos, searchQuery]);

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

  const title = data.subCategory?.name || 'Sahifa';

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* ── Header Banner & Breadcrumb ── */}
      <div className="w-full bg-[#0c1f4a] py-7 md:py-9 border-b border-white/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs sm:text-sm text-white/70 mb-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center flex-wrap gap-1 sm:gap-2">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('navbar.links.home') || 'Asosiy'}
                </Link>
              </li>
              {data.subCategory?.categoryName && (
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                    {data.subCategory.categoryId ? (
                      <Link to={`/category/${data.subCategory.categoryId}`} className="text-white/80 hover:text-white transition-colors">
                        {data.subCategory.categoryName}
                      </Link>
                    ) : (
                      <span className="text-white/80">{data.subCategory.categoryName}</span>
                    )}
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                  <span className="text-white font-medium">{title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                {data.contentType === 'TABLE' ? 'Mavjud naşrlar va röyxatlar' :
                 data.contentType === 'FEED' ? 'Sönggi xabarlar va e\'lonlar' :
                 'Yönaltiruvçi havola'}
              </p>
            </div>

            {/* ContentType Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/20 backdrop-blur-md">
                {data.contentType === 'TABLE' && <BookOpen className="w-3.5 h-3.5 text-sky-400" />}
                {data.contentType === 'FEED' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                {data.contentType === 'LINK' && <ExternalLink className="w-3.5 h-3.5 text-amber-400" />}
                <span>
                  {data.contentType === 'TABLE' ? 'Jadval' :
                   data.contentType === 'FEED' ? 'Kartalar' : 'Havola'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0c1f4a] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Ma'lumotlar yuklanmoqda...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Ma'lumot yuklanmadi</h3>
            <p className="text-sm text-red-600 mb-5">{error}</p>
            <button
              onClick={fetchInfos}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Qayta uriniş
            </button>
          </div>
        )}

        {/* Success States */}
        {!loading && !error && (
          <>
            {/* 1. LINK TYPE */}
            {data.contentType === 'LINK' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0c1f4a] flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <ExternalLink className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Uşbu sahifa boşqa bölimga yönaltirilgan:
                  <span className="block font-mono text-xs text-blue-600 bg-blue-50/70 p-2 rounded-lg mt-2 break-all border border-blue-100">
                    {data.linkPath || '—'}
                  </span>
                </p>
                {data.linkPath && (
                  <a
                    href={data.linkPath}
                    target={data.linkPath.startsWith('http') ? '_blank' : '_self'}
                    rel={data.linkPath.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0c1f4a] text-white text-sm font-semibold hover:bg-[#0a183d] transition shadow-md hover:shadow-lg"
                  >
                    <span>Sahifaga ötiş</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* 2. TABLE TYPE */}
            {data.contentType === 'TABLE' && (
              <div className="space-y-4">
                {/* Search & Actions Bar */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nom böyiça qidiriş..."
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c1f4a]/20 focus:border-[#0c1f4a] transition"
                    />
                  </div>
                  <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                    Jami: <span className="font-bold text-slate-700">{data.totalElements}</span> ta yozuv
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                          <th className="py-4 px-6 w-16 text-center">№</th>
                          <th className="py-4 px-6 min-w-[260px]">
                            {columns[1] || 'Sahifa nomi'}
                          </th>
                          <th className="py-4 px-6 w-36 text-center">
                            Sana
                          </th>
                          <th className="py-4 px-6 w-32 text-center">
                            {columns[2] || 'Köriş'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredInfos.length > 0 ? (
                          filteredInfos.map((info, idx) => {
                            const rowNumber = page * data.size + idx + 1;
                            return (
                              <tr
                                key={info.id || idx}
                                className="hover:bg-blue-50/40 transition-colors group"
                              >
                                {/* № */}
                                <td className="py-4 px-6 text-center font-semibold text-slate-500 text-xs">
                                  {rowNumber}
                                </td>

                                {/* Sahifa nomi / Title */}
                                <td className="py-4 px-6">
                                  <Link
                                    to={`/infos/${info.id}`}
                                    className="font-semibold text-slate-800 group-hover:text-[#0c1f4a] transition line-clamp-2 block"
                                  >
                                    {info.title || 'Nomsiz yozuv'}
                                  </Link>
                                  {info.content && (
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                      {info.content}
                                    </p>
                                  )}
                                  {info.fileLink && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <a
                                        href={getFileUrl(info.fileLink)}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="truncate max-w-[240px]">{info.fileName || "Biriktirilgan fayl"}</span>
                                        <Download className="w-3 h-3 text-emerald-600" />
                                      </a>
                                    </div>
                                  )}
                                </td>

                                {/* Sana */}
                                <td className="py-4 px-6 text-center text-xs text-slate-500 whitespace-nowrap">
                                  {formatDate(info.createdAt || info.publishedAt)}
                                </td>

                                {/* Köriş Action */}
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <Link
                                      to={`/infos/${info.id}`}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1f4a] text-white text-xs font-semibold hover:bg-[#0a183d] transition shadow-sm hover:shadow"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>Köriş</span>
                                    </Link>
                                    {info.fileLink && (
                                      <a
                                        href={getFileUrl(info.fileLink)}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        title="Faylni yuklab oliş"
                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-400">
                              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                              <p className="text-sm font-medium">Hozirça ma'lumotlar mavjud emas</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        Sahifa: <span className="font-bold text-slate-700">{page + 1}</span> / {data.totalPages}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPage(p => Math.max(0, p - 1))}
                          disabled={page === 0}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Oldingi
                        </button>
                        {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                          const pageNum = i;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                                page === pageNum
                                  ? 'bg-[#0c1f4a] text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-200/60'
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                          disabled={page >= data.totalPages - 1}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                        >
                          Keyingi
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. FEED TYPE */}
            {data.contentType === 'FEED' && (
              <div className="space-y-6">
                {filteredInfos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInfos.map((info) => {
                      const photoUrl = info.photoLink ? getFileUrl(info.photoLink) : null;
                      return (
                        <div
                          key={info.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                        >
                          {/* Photo Banner */}
                          <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={info.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c1f4a]/10 to-blue-50 text-[#0c1f4a]/40">
                                <FileText className="w-12 h-12" />
                              </div>
                            )}
                            {(info.publishedAt || info.createdAt) && (
                              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(info.publishedAt || info.createdAt)}</span>
                              </div>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-[#0c1f4a] transition line-clamp-2 mb-2">
                              {info.title}
                            </h3>
                            {info.content && (
                              <p className="text-xs text-slate-600 line-clamp-3 mb-4 flex-1">
                                {info.content}
                              </p>
                            )}

                            {info.fileLink && (
                              <a
                                href={getFileUrl(info.fileLink)}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="mb-3 inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
                              >
                                <div className="flex items-center gap-1.5 truncate mr-2">
                                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{info.fileName || "Faylni yuklab oliş"}</span>
                                </div>
                                <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              </a>
                            )}

                            <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                              <Link
                                to={`/infos/${info.id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c1f4a] text-white text-xs font-semibold hover:bg-[#0a183d] transition shadow-sm w-full justify-center"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Batafsil köriş</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium">Hozirça xabarlar mavjud emas</p>
                  </div>
                )}

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-4">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 transition"
                    >
                      Oldingi
                    </button>
                    <span className="text-xs text-slate-500 font-medium px-2">
                      {page + 1} / {data.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                      disabled={page >= data.totalPages - 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 transition"
                    >
                      Keyingi
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

