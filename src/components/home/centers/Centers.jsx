import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { centersAPI, localizedField } from '../../../api';

export default function Centers() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'uz';
  const [centersList, setCentersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const res = await centersAPI.getLanding(0, 8, currentLang);
        let rawData = res?.data?.content || res?.content || res?.data || (Array.isArray(res) ? res : []);
        
        if (!rawData || rawData.length === 0) {
          const fallbackRes = await centersAPI.getAll(currentLang);
          rawData = Array.isArray(fallbackRes) ? fallbackRes : (fallbackRes?.data || []);
        }

        if (isMounted) {
          const formatted = rawData.slice(0, 8).map((c, index) => {
            const title = localizedField(c, 'name', currentLang, localizedField(c, 'title', currentLang, "MARKAZ VA BO'LIM"));
            const description = localizedField(c, 'description', currentLang, "");
            return {
              id: c.id || index + 1,
              title,
              description,
              iconBg: index % 4 === 0 ? 'bg-blue-50 text-blue-600' : index % 4 === 1 ? 'bg-indigo-50 text-indigo-600' : index % 4 === 2 ? 'bg-cyan-50 text-cyan-600' : 'bg-amber-50 text-amber-600',
              borderColor: index % 4 === 0 ? 'border-t-blue-500' : index % 4 === 1 ? 'border-t-indigo-500' : index % 4 === 2 ? 'border-t-cyan-500' : 'border-t-amber-500'
            };
          });
          setCentersList(formatted);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load home landing centers:', err.message);
        if (isMounted) {
          setCentersList([]);
          setLoading(false);
        }
      }
    };

    fetchCenters();
    return () => { isMounted = false; };
  }, [currentLang]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
    if (elements) {
      elements.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [centersList]);

  if (!loading && centersList.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="w-full bg-[#f8faff] py-12 md:py-16 text-left border-t border-b border-slate-100" aria-labelledby="centers-heading">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="relative flex flex-col items-center justify-center mb-10 gap-4 text-center reveal-on-scroll opacity-0">
          <h2 id="centers-heading" className="flex items-center justify-center gap-3 md:gap-4 font-bold tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
            -
            <Building2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
            {t('home.centers.title', "Markaz va bo'limlar")}
            -
          </h2>
          <Link to="/centers" className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center text-sm font-semibold text-blue-600 hover:text-[#0c1f4a] transition-colors">
            {t('home.centers.view_all', "Barchasi")} <ChevronRight className="h-4 w-4 ml-0.5" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          /* Centers Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {centersList.map((center, idx) => (
              <div
                key={center.id}
                className={`bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${center.borderColor} reveal-on-scroll opacity-0`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-3.5 items-start mb-4">
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-bold ${center.iconBg}`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-[#0c1f4a] text-[13px] md:text-[14px] uppercase tracking-wide leading-tight mt-1 line-clamp-2">
                      {center.title}
                    </h3>
                  </div>

                  <p className="text-slate-500 text-[13px] leading-relaxed mb-5 flex-grow line-clamp-3">
                    {center.description || "Urganch davlat pedagogika institutining rasmiy markaz va bo'limi."}
                  </p>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/centers/${center.id}`}
                      className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-[13px] hover:text-[#0c1f4a] transition-colors"
                    >
                      Batafsil <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
