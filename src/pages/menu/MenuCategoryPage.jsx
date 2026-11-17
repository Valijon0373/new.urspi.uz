import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight, ArrowRight, BookOpen, FileText, ExternalLink,
  Layers, AlertCircle, RefreshCw
} from 'lucide-react';
import { menuLandingAPI, onMenuHierarchyChange } from '../../api';

export default function MenuCategoryPage() {
  const { menuId, categoryId } = useParams();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [parentMenuName, setParentMenuName] = useState('');
  const [parentMenuId, setParentMenuId] = useState(null);
  const [categoriesWithSub, setCategoriesWithSub] = useState([]);

  const currentLang = (i18n.language || 'uz').split('-')[0].toLowerCase();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (menuId) {
        const menuInfo = await menuLandingAPI.getMenuById(menuId, currentLang);
        const catList = await menuLandingAPI.getCategories(menuId, currentLang);

        const fullData = await Promise.all(
          catList.map(async (cat) => {
            try {
              const subs = await menuLandingAPI.getSubCategories(cat.id, currentLang);
              return { ...cat, subCategories: subs };
            } catch (e) {
              return { ...cat, subCategories: [] };
            }
          })
        );
        setCategoriesWithSub(fullData);
        setTitle(menuInfo?.name || fullData[0]?.menuName || "Menyu bölimlari");
        setParentMenuName('');
        setParentMenuId(null);
      } else if (categoryId) {
        const catInfo = await menuLandingAPI.getCategoryById(categoryId, currentLang);
        const subs = await menuLandingAPI.getSubCategories(categoryId, currentLang);
        const catName = catInfo?.name || subs[0]?.categoryName || "Kategoriya bölimlari";
        setCategoriesWithSub([
          {
            ...(catInfo || {}),
            id: categoryId,
            name: catName,
            subCategories: subs
          }
        ]);
        setTitle(catName);
        setParentMenuName(catInfo?.menuName || subs[0]?.menuName || '');
        setParentMenuId(catInfo?.menuId || subs[0]?.menuId || null);
      }
    } catch (err) {
      setError(err.message || "Ma'lumotlarni yuklaşda xatolik");
    } finally {
      setLoading(false);
    }
  }, [menuId, categoryId, currentLang]);

  useEffect(() => {
    fetchData();
    const unsub = onMenuHierarchyChange(() => fetchData());
    return () => unsub();
  }, [fetchData]);

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* ── Header Banner & Breadcrumb ── */}
      <div className="w-full bg-[#0c1f4a] py-7 md:py-9 border-b border-white/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="flex items-center text-xs sm:text-sm text-white/70 mb-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center flex-wrap gap-1 sm:gap-2">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('navbar.links.home') || 'Asosiy'}
                </Link>
              </li>
              {parentMenuName && parentMenuId && (
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                    <Link to={`/menu/${parentMenuId}`} className="hover:text-white transition-colors">
                      {parentMenuName}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mx-1 text-white/50" />
                  <span className="text-white font-medium">{title || "Bölimlar"}</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title || "Bölimlar"}
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Barça bölimlar va sahifalar ierarxiyasi
          </p>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0c1f4a] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Bölimlar yuklanmoqda...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Ma'lumot yuklanmadi</h3>
            <p className="text-sm text-red-600 mb-5">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Qayta uriniş
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10">
            {categoriesWithSub.length > 0 ? (
              categoriesWithSub.map((category) => {
                const hasSubs = Array.isArray(category.subCategories) && category.subCategories.length > 0;
                const catDirectLink = category.linkPath && category.linkPath !== '#' ? category.linkPath : null;

                return (
                  <div key={category.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#0c1f4a]">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
                          <p className="text-xs text-slate-500">
                            {hasSubs
                              ? `${category.subCategories.length} ta quyi bölim`
                              : catDirectLink
                              ? `Töğridan-töğri sahifa (${catDirectLink})`
                              : "Bölim ma'lumotlari"}
                          </p>
                        </div>
                      </div>

                      {catDirectLink && (
                        <Link
                          to={catDirectLink}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1f4a] text-white text-xs font-semibold hover:bg-[#0a183d] transition self-start sm:self-auto"
                        >
                          <span>Sahifaga ötiş</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    {hasSubs ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {category.subCategories.map((sub) => {
                          const targetUrl = sub.contentType === 'LINK' && sub.linkPath && sub.linkPath !== '#'
                            ? sub.linkPath
                            : `/subcategories/${sub.id}`;

                          const isExternal = sub.contentType === 'LINK' && sub.linkPath && sub.linkPath.startsWith('http');

                          return (
                            <Link
                              key={sub.id}
                              to={isExternal ? '#' : targetUrl}
                              onClick={isExternal ? (e) => { e.preventDefault(); window.open(targetUrl, '_blank'); } : undefined}
                              className="p-5 rounded-xl border border-slate-200/90 hover:border-[#0c1f4a]/40 bg-slate-50/50 hover:bg-blue-50/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                            >
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#0c1f4a] group-hover:bg-[#0c1f4a] group-hover:text-white transition">
                                  {sub.contentType === 'TABLE' && <BookOpen className="w-5 h-5" />}
                                  {sub.contentType === 'FEED' && <FileText className="w-5 h-5" />}
                                  {sub.contentType === 'LINK' && <ExternalLink className="w-5 h-5" />}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {sub.infosCount > 0 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0c1f4a] border border-blue-100">
                                      {sub.infosCount} ta yozuv
                                    </span>
                                  )}
                                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                                    {sub.contentType === 'TABLE' ? 'Jadval' : sub.contentType === 'FEED' ? 'Kartalar' : 'Havola'}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-[#0c1f4a] transition text-base mb-1">
                                  {sub.name}
                                </h3>
                                <p className="text-xs flex items-center gap-1 mt-3 text-[#0c1f4a] font-semibold">
                                  <span>Köriş</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : catDirectLink ? (
                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Uşbu bölim asosiy sahifaga biriktirilgan: <strong className="font-mono text-[#0c1f4a]">{catDirectLink}</strong>
                        </span>
                        <Link
                          to={catDirectLink}
                          className="text-xs font-bold text-[#0c1f4a] hover:underline flex items-center gap-1"
                        >
                          Oçiş <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic py-4">
                        Uşbu kategoriyada hozirça bölimlar yöq
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                <Layers className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium">Hozirça bölimlar mavjud emas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
