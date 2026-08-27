import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { GrSend } from 'react-icons/gr'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import menImg from '../../assets/men.jpg'
import placeholderImg from '../../assets/images/bg23.jpg'
import { teachersAPI, getFileUrl, resolvePersonPosition, isDepartmentHead, localizedField, positionsAPI } from '../../api'

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

const StaffCard = ({ id, name, degree, position, img }) => (
  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden p-3 pb-0">
      <img src={img} alt={name} className="w-full h-full object-cover object-top rounded-t-lg" onError={(e) => { e.target.onerror = null; e.target.src = menImg; }} />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h4 className="text-[13px] md:text-[14px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-snug mb-3">
        {name}
      </h4>
      <p className="text-slate-600 text-[13px] mb-1">
        {degree}
      </p>
      <p className="text-slate-600 text-[13px] mb-6">
        {position}
      </p>
      
      <div className="mt-auto">
        <Link to={`/employee/${id}`} className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-medium text-[13px] transition-colors duration-300">
          Batafsil <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
)

export default function DepartmentStaffPage() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'uz';
  const selectedDepartment = location.state?.department;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

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
            console.warn('Failed to fetch department teachers from API:', e2.message);
          }
        }
        if (posRes.status === 'fulfilled') {
          positions = Array.isArray(posRes.value) ? posRes.value : (posRes.value?.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch department teachers from API:', err.message);
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
        let formatted = rawData.map(t => {
          const posId = t.positionId || t.position?.id;
          const nestedPos = (t.position && typeof t.position === 'object') ? t.position : null;
          const posObj = (nestedPos && (nestedPos.nameUz || nestedPos.name || nestedPos.nameRu || nestedPos.nameEn || nestedPos.titleUz))
            ? nestedPos
            : (positions.find(p => String(p.id) === String(posId)) || nestedPos);
          const person = { ...t, position: posObj || t.position };
          return {
          id: t.id,
          name: localizedField(t, 'fullName', lang, t.fullName || "O'qituvchi"),
          position: resolvePersonPosition(person, lang),
          degree: localizedField(t.academicDegree, 'name', lang, typeof t.academicDegree === 'string' ? t.academicDegree : ''),
          phone: t.phoneNumber || t.phone || "+998 90 123 45 67",
          email: t.email || "info@urspi.uz",
          img: getFileUrl(t.photoLink || t.photo || t.image) || menImg,
          departmentId: t.departmentId || t.department?.id,
          departmentName: t.departmentName || t.department?.nameUz || t.department?.name,
          raw: person,
        };
        });

        if (selectedDepartment) {
          const deptIdStr = String(selectedDepartment.id || '');
          const deptNameStr = (typeof selectedDepartment === 'string' ? selectedDepartment : (selectedDepartment.name || '')).toLowerCase();
          const filtered = formatted.filter(t => {
            const tDeptId = String(t.departmentId || '');
            const tDeptName = String(t.departmentName || '').toLowerCase();
            return (deptIdStr && tDeptId === deptIdStr) || 
                   (deptNameStr && tDeptName.includes(deptNameStr)) ||
                   (tDeptName && deptNameStr.includes(tDeptName));
          });
          if (filtered.length > 0) {
            formatted = filtered;
          }
        }

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
  }, [selectedDepartment, lang]);

  const mudir = teachers.find(t => isDepartmentHead(t.raw || t));
  const otherTeachers = mudir ? teachers.filter(t => t !== mudir) : teachers;
  const deptTitle = (typeof selectedDepartment === 'string' ? selectedDepartment : selectedDepartment?.name) || "Kafedra o'qituvchilari";

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
                  <Link to="/departments" className="hover:text-white transition-colors">
                    Kafedralar
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">{deptTitle}</span>
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
          ) : teachers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium">O'qituvchilar topilmadi</div>
          ) : (
            <>
              {/* Kafedra mudiri Section */}
              {mudir && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Заведующий кафедрой' : lang === 'en' ? 'Head of Department' : 'Kafedra mudiri'}
                  </div>

                  <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-5 md:p-6 gap-6 relative mb-12">
                    <div className="w-[180px] md:w-[220px] shrink-0 mx-auto md:mx-0">
                      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img
                          src={mudir.img}
                          alt={mudir.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.onerror = null; e.target.src = menImg; }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col h-full w-full">
                      <div className="mb-6 mt-2 text-center md:text-left">
                        <h3 className="text-[20px] md:text-[24px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                          {mudir.name}
                        </h3>
                        <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                          {mudir.position}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                        <div>
                          <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <DeskPhoneIcon size={18} /> {lang === 'ru' ? 'Телефон:' : lang === 'en' ? 'Phone:' : 'Telefon raqam:'}
                          </div>
                          <div className="text-slate-700 font-semibold">{mudir.phone}</div>
                        </div>
                        <div>
                          <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <HiOutlineMail size={20} /> {lang === 'ru' ? 'Эл. почта:' : lang === 'en' ? 'Email:' : 'Elektron pochta:'}
                          </div>
                          <div className="text-slate-700 font-semibold">{mudir.email}</div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4 border-t border-slate-100 pt-6">
                        <Link to={`/employee/${mudir.id}`} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-semibold transition-colors duration-300 w-full sm:w-auto">
                          {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'More details' : 'Batafsil'} <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Kafedra o'qituvchilari Section */}
              {otherTeachers.length > 0 && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Преподаватели кафедры' : lang === 'en' ? 'Department Teachers' : "Kafedra o'qituvchilari"}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {otherTeachers.map((teacher) => (
                      <StaffCard
                        key={teacher.id}
                        id={teacher.id}
                        name={teacher.name}
                        degree={teacher.degree}
                        position={teacher.position}
                        img={teacher.img}
                      />
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
