import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { GrSend } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import menImg from '../../assets/men.jpg'
import { teachersAPI, getFileUrl, resolvePersonPosition, isFacultyDean, isViceDean, localizedField, positionsAPI } from '../../api'

const DeskPhoneIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.5 12L3 21C2.8 21.6 3.2 22 3.8 22H20.2C20.8 22 21.2 21.6 21 21L18.5 12C18.2 10.8 17 10 15.8 10H8.2C7 10 5.8 10.8 5.5 12Z" />
    <path d="M19.5 8C20.9 8 22 6.9 22 5.5C22 4.1 17.5 2 12 2C6.5 2 2 4.1 2 5.5C2 6.9 3.1 8 4.5 8C5.2 8 5.8 7.6 6.1 7L7.5 6C8.8 5.2 10.4 5 12 5C13.6 5 15.2 5.2 16.5 6L17.9 7C18.2 7.6 18.8 8 19.5 8Z" />
    <rect x="8" y="13" width="2" height="2" fill="white" />
    <rect x="11" y="13" width="2" height="2" fill="white" />
    <rect x="14" y="13" width="2" height="2" fill="white" />
    <rect x="8" y="16" width="2" height="2" fill="white" />
    <rect x="11" y="16" width="2" height="2" fill="white" />
    <rect x="14" y="16" width="2" height="2" fill="white" />
    <rect x="8" y="19" width="2" height="2" fill="white" />
    <rect x="11" y="19" width="2" height="2" fill="white" />
    <rect x="14" y="19" width="2" height="2" fill="white" />
  </svg>
)

export default function FacultyStaffPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const lang = i18n.language || 'uz';

  useEffect(() => {
    let isMounted = true;
    const fetchTeachers = async () => {
      setLoading(true);
      let apiData = [];
      let positions = [];
      try {
        const [res, posRes] = await Promise.allSettled([
          teachersAPI.getLanding(0, 100),
          positionsAPI.getAll()
        ]);
        if (res.status === 'fulfilled') {
          const payload = res.value;
          apiData = payload?.data?.content || (Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
        } else {
          try {
            const fallback = await teachersAPI.getAll('uz');
            apiData = Array.isArray(fallback) ? fallback : (fallback?.data || []);
          } catch (e2) {
            console.warn('Failed to fetch teachers from API:', e2.message);
          }
        }
        if (posRes.status === 'fulfilled') {
          positions = Array.isArray(posRes.value) ? posRes.value : (posRes.value?.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch teachers from API:', err.message);
      }

      let localPositions = [];
      try {
        localPositions = JSON.parse(localStorage.getItem('urspi_custom_positions') || '[]');
      } catch (e) {}

      const posMap = new Map();
      positions.forEach(p => posMap.set(String(p.id), p));
      localPositions.forEach(p => posMap.set(String(p.id), p));
      positions = Array.from(posMap.values());

      let localItems = [];
      try {
        localItems = JSON.parse(localStorage.getItem('urspi_custom_teachers') || '[]');
      } catch (e) {}

      const combinedMap = new Map();
      apiData.forEach(t => combinedMap.set(String(t.id), t));
      localItems.forEach(t => {
        const key = String(t.id);
        if (!combinedMap.has(key)) combinedMap.set(key, t);
        else {
          const api = combinedMap.get(key);
          combinedMap.set(key, {
            ...api,
            ...t,
            photo: t.photo || api.photo,
            image: t.image || api.image,
            photoLink: t.photoLink || api.photoLink,
            position: t.position || api.position,
            positionId: t.positionId || api.positionId || api.position?.id,
            positionTitleUz: t.positionTitleUz || localizedField(api, 'positionTitle', 'uz', ''),
            positionTitleRu: t.positionTitleRu || localizedField(api, 'positionTitle', 'ru', ''),
            positionTitleEn: t.positionTitleEn || localizedField(api, 'positionTitle', 'en', ''),
          });
        }
      });

      const rawData = Array.from(combinedMap.values());
      if (isMounted) {
        const formatted = rawData.map(t => {
          const posId = t.positionId || t.position?.id;
          const nestedPos = (t.position && typeof t.position === 'object') ? t.position : null;
          const posObj = (nestedPos && (nestedPos.nameUz || nestedPos.name || nestedPos.nameRu || nestedPos.nameEn || nestedPos.titleUz))
            ? nestedPos
            : (positions.find(p => String(p.id) === String(posId)) || nestedPos);
          const person = { ...t, position: posObj || t.position };
          return {
            id: t.id,
            fullName: localizedField(t, 'fullName', lang, t.fullNameUz || t.fullName || "Fakultet xodimi"),
            position: resolvePersonPosition(person, lang),
            phone: t.phoneNumber || t.phone || "",
            email: t.email || "",
            degree: localizedField(t.academicDegree, 'name', lang, typeof t.academicDegree === 'string' ? t.academicDegree : ""),
            photo: t.photo || t.image || getFileUrl(t.photoLink || t.photo) || menImg,
            officeHours: t.officeHours || t.receptionTime || "10:00-18:00",
            raw: person,
          };
        });
        setTeachers(formatted);
        setLoading(false);
      }
    };

    fetchTeachers();

    const handleUpdate = () => fetchTeachers();
    window.addEventListener('urspi_teachers_updated', handleUpdate);

    return () => { 
      isMounted = false; 
      window.removeEventListener('urspi_teachers_updated', handleUpdate);
    };
  }, [lang]);

  const dekan = teachers.find(t => isFacultyDean(t.raw || t));
  const viceDeans = teachers.filter(t => isViceDean(t.raw || t) && String(t.id) !== String(dekan?.id));

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* Header Banner */}
      <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/faculties" className="hover:text-white transition-colors">
                    Fakultetlar
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">Fakultet xodimlari</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Yuklanmoqda...</div>
          ) : !dekan && viceDeans.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">Fakultet xodimlari topilmadi</div>
          ) : (
            <>
              {/* Fakultet dekani Section */}
              {dekan && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Декан факультета' : lang === 'en' ? 'Dean of Faculty' : 'Fakultet dekani'}
                  </div>

                  <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-6 md:p-8 gap-6 md:gap-8 relative mb-12">
                    {/* Qabul vaqtlari pill in top-right corner */}
                    {dekan.officeHours && (
                      <div className="absolute top-6 right-6 bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-2 text-right hidden sm:block">
                        <div className="text-[11px] text-blue-500 font-medium">Qabul vaqtlari:</div>
                        <div className="text-[13px] text-blue-700 font-bold">{dekan.officeHours}</div>
                      </div>
                    )}

                    <div className="w-[180px] md:w-[220px] shrink-0 mx-auto md:mx-0">
                      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                        <img
                          src={dekan.photo}
                          alt={dekan.fullName}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.onerror = null; e.target.src = menImg; }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col h-full w-full">
                      <div className="mb-6 mt-1 text-center md:text-left pr-0 sm:pr-32">
                        <h3 className="text-[22px] md:text-[26px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight mb-1.5">
                          {dekan.fullName}
                        </h3>
                        {dekan.degree && (
                          <p className="text-slate-500 text-[14px] font-medium">
                            {dekan.degree}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-6">
                        {dekan.phone && (
                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <DeskPhoneIcon size={16} /> {lang === 'ru' ? 'Телефон:' : lang === 'en' ? 'Phone:' : 'TELEFON RAQAM:'}
                            </div>
                            <div className="text-slate-800 text-[14px] font-bold">{dekan.phone}</div>
                          </div>
                        )}
                        {dekan.email && (
                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <HiOutlineMail size={18} /> {lang === 'ru' ? 'Эл. почта:' : lang === 'en' ? 'Email:' : 'ELEKTRON POCHTA:'}
                            </div>
                            <div className="text-slate-800 text-[14px] font-bold">{dekan.email}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                        <Link to={`/employee/${dekan.id}`} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-colors duration-300 w-full sm:w-auto">
                          {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'More details' : 'Batafsil'} <ArrowRight size={16} />
                        </Link>

                        <a href="https://t.me/urspi_dekan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold text-sm transition-colors duration-300 w-full sm:w-auto shadow-sm">
                          <GrSend className="w-4 h-4" />
                          {lang === 'ru' ? 'Обращение к декану' : lang === 'en' ? 'Contact Dean' : "Dekanga murojaat yo'llash"}
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Dekan o'rinbosarlari Section */}
              {viceDeans.length > 0 && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Заместители декана' : lang === 'en' ? 'Vice Deans' : "Dekan o'rinbosarlari"}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {viceDeans.map(person => (
                      <div key={person.id} className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-start p-5 gap-5 transition-all duration-300 hover:shadow-md">
                        <div className="w-[140px] sm:w-[160px] shrink-0 mx-auto sm:mx-0">
                          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                            <img src={person.photo} alt={person.fullName} className="w-full h-full object-cover object-top" onError={(e) => { e.target.onerror = null; e.target.src = menImg; }} />
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col w-full h-full">
                          <div className="mb-3">
                            <h4 className="text-[17px] sm:text-[19px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight mb-1">
                              {person.fullName}
                            </h4>
                            {person.degree && (
                              <p className="text-slate-500 text-[13px] font-medium">
                                {person.degree}
                              </p>
                            )}
                          </div>

                          <div className="mb-3">
                            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">LAVOZIMI:</div>
                            <div className="text-slate-800 text-[13px] font-medium leading-snug">{person.position}</div>
                          </div>

                          {person.phone && (
                            <div className="mb-5">
                              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1"><DeskPhoneIcon size={14} /> TELEFON RAQAM:</div>
                              <div className="text-slate-800 text-[13px] font-bold">{person.phone}</div>
                            </div>
                          )}

                          <div className="mt-auto">
                            <Link to={`/employee/${person.id}`} className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs transition-colors duration-300">
                              {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'More details' : 'Batafsil'} <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
