import React, { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { facultiesAPI, departmentsAPI, localizedField } from '../../api'

const getSidebarLinks = (t) => [
  { name: t('navbar.links.history'), path: '/infographic' },
  { name: t('navbar.links.charter'), path: '#' },
  { name: t('navbar.links.leadership'), path: '/leadership' },
  { name: t('navbar.links.faculties'), path: '/faculties' },
  { name: t('navbar.links.departments'), path: '/departments' },
  { name: t('navbar.links.centers'), path: '/centers' },
];

export default function DepartmentsPage() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [facultiesList, setFacultiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarLinks = getSidebarLinks(t);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const lang = i18n.language || 'uz';
      let rawFac = [];
      let rawDept = [];
      try {
        const [facRes, deptRes] = await Promise.allSettled([
          facultiesAPI.getLanding(0, 50, lang),
          departmentsAPI.getLanding(0, 50, lang)
        ]);

        rawFac = facRes.status === 'fulfilled' ? (Array.isArray(facRes.value) ? facRes.value : facRes.value?.data?.content || facRes.value?.data || []) : [];
        rawDept = deptRes.status === 'fulfilled' ? (Array.isArray(deptRes.value) ? deptRes.value : deptRes.value?.data?.content || deptRes.value?.data || []) : [];
      } catch (err) {
        console.warn('Failed to load landing departments from API:', err.message);
      }

      const combinedFac = rawFac;
      const combinedDept = rawDept;

      if (isMounted) {
        const formatted = combinedFac.map(fac => {
          const facName = localizedField(fac, 'name', lang, "FAKULTET");

          const depts = combinedDept
            .filter(d => (d.faculty?.id === fac.id) || (d.facultyId === fac.id) || (d.faculty === fac.name))
            .map(d => ({
              id: d.id,
              name: localizedField(d, 'name', lang, "Kafedra")
            }));

          return {
            id: fac.id,
            name: facName,
            departments: depts
          };
        });
        setFacultiesList(formatted);
        setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [i18n.language]);

  return (
    <div className="flex-grow bg-white flex flex-col min-h-[calc(100vh-200px)]">
      {/* Header Banner */}
      <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('navbar.links.home')}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">{t('navbar.links.departments')}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar */}
            <div className="w-full lg:w-[300px] shrink-0 border border-slate-200 rounded-sm overflow-hidden">
              <div className="bg-[#0c1f4a] px-5 py-4">
                <h3 className="font-bold text-white text-[15px] uppercase tracking-wide">{t('navbar.links.structure')}</h3>
              </div>
              <ul className="flex flex-col">
                {sidebarLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={index} className="border-b border-slate-100 last:border-b-0">
                      <Link 
                        to={link.path}
                        className={`block px-5 py-3.5 text-[14px] transition-colors duration-200 ${
                          isActive 
                            ? 'text-blue-600 font-medium bg-blue-50/30' 
                            : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
              <div className="mb-8 border-b-2 border-slate-200 pb-3">
                <h1 className="text-2xl md:text-[28px] font-bold text-[#0c1f4a]">{t('navbar.links.departments')}</h1>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {facultiesList.map((faculty) => (
                    <div key={faculty.id} className="flex flex-col w-full">
                      {/* Faculty Header */}
                      <div className="bg-[#0c1f4a] text-white px-5 py-3.5 font-medium text-[14px] sm:text-[15px] uppercase tracking-wide rounded-xl mb-4 shadow-sm">
                        {faculty.name}
                      </div>
                      {/* Departments List */}
                      <div className="flex flex-col w-full gap-3">
                        {faculty.departments.map((dep, idx) => (
                          <Link 
                            to="/department-staff"
                            state={{ department: dep }}
                            key={dep.id || idx} 
                            className="flex items-center gap-3 border border-slate-200 rounded-xl px-5 py-4 text-[13px] sm:text-[14px] text-[#0c1f4a] font-semibold transition-all duration-300 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white group"
                          >
                            <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 transition-transform group-hover:translate-x-1" />
                            <span>{typeof dep === 'string' ? dep : dep.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
