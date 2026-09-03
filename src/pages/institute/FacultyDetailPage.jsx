import React, { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoImg from '../../assets/images/logo1.jpg'
import { facultiesAPI, getFileUrl, localizedField } from '../../api'

export default function FacultyDetailPage() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const stateFaculty = location.state?.faculty;

  const [faculty, setFaculty] = useState(stateFaculty || null);
  const [loading, setLoading] = useState(!stateFaculty);

  useEffect(() => {
    if (!stateFaculty) {
      const fetchFirstFaculty = async () => {
        setLoading(true);
        const lang = i18n.language || 'uz';
        try {
          const res = await facultiesAPI.getLanding(0, 1, lang);
          const data = res?.data?.content?.[0] || res?.data?.[0] || res?.[0];
          if (data) {
            setFaculty({
              id: data.id,
              name: localizedField(data, 'name', lang, "Fakultet"),
              description: localizedField(data, 'description', lang, "Fakultet haqida batafsil ma'lumot"),
              logo: getFileUrl(data.logoLink || data.logo) || logoImg
            });
          }
        } catch (e) {
          console.warn("Failed to fetch faculty detail:", e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFirstFaculty();
    }
  }, [stateFaculty, i18n.language]);

  const titleName = faculty?.name || faculty?.title || "PEDAGOGIKA FAKULTETI";
  const descText = faculty?.description || faculty?.descriptionUz || "O‘zbekiston Respublikasi Prezidentining 2022 yil 21-iyundagi PQ-289-sonli qaroriga asosan Urganch davlat pedagogika instituti tashkil etildi.";

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* Header Banner */}
      <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/faculties" className="hover:text-white transition-colors">
                    {t('common.faculties')}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">{t('common.faculty')}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 md:p-12 relative overflow-hidden">
              {/* Background design element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              {/* Logo and Title */}
              <div className="flex flex-col items-center mb-10 relative z-10">
                <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white ring-4 ring-blue-50 bg-white">
                  <img src={faculty?.logo || logoImg} alt={titleName} className="w-full h-full object-cover object-center" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#0c1f4a] uppercase tracking-tight leading-tight mt-2">
                  {titleName} TARIXI
                </h1>
                <div className="w-24 h-1.5 bg-[#3b82f6] rounded-full mt-6"></div>
              </div>

              {/* History Content */}
              <div className="prose max-w-none text-slate-700 leading-relaxed space-y-5 text-[15px] sm:text-[16px] text-justify relative z-10">
                <p>{descText}</p>
                <p>
                  Fakultet – institutining tarkibiy tuzilmasi hisoblanadi. Uning faoliyati tegishli ta'lim yo'nalishlari va mutaxassisliklari bo'yicha talabalarni o'qitish, ta'lim-tarbiya jarayonlarini uzviy hamda uyg'unlashgan xolda olib borish, shuningdek, kafedralarda ilmiy tadqiqot loyihalarini bajarish ishlarini muvofiqlashtirishga yo'naltiriladi.
                </p>
                <p>
                  Fakultet internet tizimida institutning rasmiy <strong><a href="https://urspi.uz" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">www.UrSPI.uz</a></strong> saytida o'z bo'limiga ega.
                </p>
              </div>

              {/* Directions Box */}
              {faculty?.departments && faculty.departments.length > 0 && (
                <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 relative z-10 shadow-sm">
                  <h2 className="text-[18px] sm:text-xl font-bold text-[#0c1f4a] mb-8 uppercase text-center flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-slate-300 hidden sm:block"></span>
                    FAKULTET TARKIBIDAGI KAFEDRALAR
                    <span className="w-8 h-px bg-slate-300 hidden sm:block"></span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faculty.departments.map((dep, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                        <span className="font-semibold text-[#0c1f4a]">{typeof dep === 'string' ? dep : dep.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
