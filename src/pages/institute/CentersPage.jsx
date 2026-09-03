import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { renderCenterIcon, getAutoIcon } from '../../data/centersData'
import { centersAPI, localizedField } from '../../api'

export const centers = [];

export default function CentersPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'uz';
  const [centerList, setCenterList] = useState([]);

  useEffect(() => {
    loadCenters();
    const handleUpdate = () => loadCenters();
    window.addEventListener('urspi_centers_updated', handleUpdate);
    return () => window.removeEventListener('urspi_centers_updated', handleUpdate);
  }, [currentLang]);

  const loadCenters = async () => {
    try {
      const res = await centersAPI.getLanding(0, 100, currentLang);
      let rawData = res?.data?.content || res?.content || res?.data || (Array.isArray(res) ? res : []);
      if (!rawData || rawData.length === 0) {
        const fallback = await centersAPI.getAll(currentLang);
        rawData = Array.isArray(fallback) ? fallback : (fallback?.data || []);
      }
      const formatted = rawData.map((c, index) => {
        const centerTitle = localizedField(c, 'name', currentLang, localizedField(c, 'title', currentLang, "MARKAZ"));
        return {
          id: c.id || index + 1,
          title: centerTitle,
          description: localizedField(c, 'description', currentLang, ""),
          borderColor: index % 4 === 0 ? "border-t-blue-500" : index % 4 === 1 ? "border-t-indigo-500" : index % 4 === 2 ? "border-t-cyan-500" : "border-t-amber-500",
          iconBg: index % 4 === 0 ? "bg-blue-50 text-blue-600" : index % 4 === 1 ? "bg-indigo-50 text-indigo-600" : index % 4 === 2 ? "bg-cyan-50 text-cyan-600" : "bg-amber-50 text-amber-600",
          iconName: c.iconName || c.icon || getAutoIcon(centerTitle)
        };
      });
      setCenterList(formatted);
      setCenterList(formatted);
    } catch (e) {
      console.warn('Failed to load centers from API:', e.message);
      setCenterList([]);
    }
  };

  const getTitle = (center) => {
    if (typeof center.title === 'string') return center.title;
    return center.title?.[currentLang] || center.title?.uz || center.title?.ru || center.title?.en || '';
  };

  const getDesc = (center) => {
    if (typeof center.description === 'string') return center.description;
    return center.description?.[currentLang] || center.description?.uz || center.description?.ru || center.description?.en || '';
  };

  return (
    <div className="flex-grow bg-[#f8faff] flex flex-col min-h-[calc(100vh-200px)] pt-6 md:pt-10">
      <div className="flex flex-col flex-grow relative overflow-hidden">
        {/* Background building illustration */}
        <div className="absolute top-0 right-0 lg:right-10 pointer-events-none hidden md:block z-0">
          <img 
            src="/building.png" 
            alt="Building Illustration" 
            className="w-[300px] lg:w-[450px] object-contain opacity-90 mix-blend-multiply"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
          
          <div className="mb-10 pt-4 md:pt-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c1f4a] mb-4">
              {t('common.centers')}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {centerList.map((center) => (
              <div 
                key={center.id} 
                className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${center.borderColor || 'border-t-blue-500'}`}
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-4 items-start mb-5">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${center.iconBg || 'bg-blue-50'}`}>
                      {renderCenterIcon(center.iconName, "w-8 h-8 text-[#0c1f4a]")}
                    </div>
                    <h3 className="font-bold text-[#0c1f4a] text-[13px] md:text-[14px] uppercase tracking-wide leading-tight mt-1">
                      {getTitle(center)}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3">
                    {getDesc(center)}
                  </p>
                  
                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                    <Link 
                      to={`/centers/${center.id}`} 
                      className="inline-flex items-center gap-2 text-blue-600 font-bold text-[13px] hover:text-[#0c1f4a] transition-colors"
                    >
                      {t('home.carousel.details')} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
