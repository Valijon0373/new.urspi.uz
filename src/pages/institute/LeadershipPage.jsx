import React, { useState, useEffect } from 'react'
import { MapPin, Mail, Clock, Phone, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Commet } from 'react-loading-indicators'
import rektorImg from '../../assets/men.jpg'
import { leadersAPI, getFileUrl, localizedField } from '../../api'

const prorektorCardClass =
  'w-full h-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col xl:flex-row items-start p-5 gap-5 xl:gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/60 hover:-translate-y-0.5'

export default function LeadershipPage() {
  const { t, i18n } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || 'uz';
        let res;
        try {
          res = await leadersAPI.getLanding(0, 50, lang);
        } catch (e) {
          res = await leadersAPI.getAll(lang);
        }
        
        const rawData = Array.isArray(res) ? res : (res?.data?.content || res?.data || []);
        
        if (isMounted) {
          const formatted = rawData.map((item, index) => {
            const fullName = localizedField(item, 'fullName', lang, "Rahbar");
            const positionTitle = localizedField(item, 'positionTitle', lang, "Lavozim");
            const address = localizedField(item, 'address', lang, "Urganch shahri, Gurlan ko'chasi 1A-uy");
            const receptionTime = localizedField(item, 'receptionTime', lang, "09:00 - 17:00");
            const email = item.email || "info@urspi.uz";
            const phoneNumber = item.phoneNumber || item.phone || "+998622261840";
            const photo = getFileUrl(item.photoLink || item.photo || item.image || item.fileLink) || rektorImg;

            const posLower = (positionTitle || '').toLowerCase();
            const isRektor = posLower.includes('rektor') && !posLower.includes('prorektor') && !posLower.includes('maslahatchi') && !posLower.includes("o'rinbosar") && !posLower.includes("o‘rinbosar");

            return {
              id: item.id || index + 1,
              fullName,
              positionTitle,
              address,
              receptionTime,
              email,
              phoneNumber,
              photo,
              isRektor
            };
          });
          setLeaders(formatted);
        }
      } catch (err) {
        console.warn('Failed to load leaders from API:', err.message);
        if (isMounted) setLeaders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaders();
    return () => { isMounted = false; };
  }, [i18n.language]);

  const rektor = leaders.find(l => l.isRektor) || (leaders.length > 0 ? leaders[0] : null);
  const prorektors = rektor ? leaders.filter(l => l !== rektor) : [];

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
                  <span className="text-white font-medium">{t('common.leadership')}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Commet color="#3151cc" size="large" text="Kuting..." textColor="" />
            </div>
          ) : leaders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 font-medium">Hozircha rahbarlar ma'lumotlari mavjud emas.</p>
            </div>
          ) : (
            <>
              {/* Card — Rektor */}
              {rektor && (
                <div className="w-full max-w-5xl mx-auto bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row p-5 md:p-7 gap-6 md:gap-10 transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/60 hover:-translate-y-0.5">

                  {/* Left: Image Frame */}
                  <div className="w-full md:w-[260px] shrink-0">
                    <div className="w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={rektor.photo}
                        alt={rektor.fullName}
                        className="w-full h-full object-cover rounded-xl object-top"
                        onError={(e) => { e.target.onerror = null; e.target.src = rektorImg; }}
                      />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="w-full flex flex-col justify-center py-2">
                    <div className="mb-6">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[13px] font-semibold mb-3">
                        {rektor.positionTitle}
                      </span>
                      <h2 className="text-[26px] md:text-[32px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                        {rektor.fullName}
                      </h2>
                    </div>

                    <div className="space-y-4 text-slate-500 font-medium">

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                        <span className="text-base">{rektor.address}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#3b82f6] shrink-0" />
                        <span className="text-base">{rektor.receptionTime}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#3b82f6] shrink-0" />
                        <a href={`mailto:${rektor.email}`} className="text-base hover:text-[#3b82f6] transition-colors">{rektor.email}</a>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#3b82f6] shrink-0" />
                        <a href={`tel:${rektor.phoneNumber}`} className="text-base hover:text-[#3b82f6] transition-colors">{rektor.phoneNumber}</a>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Prorektors Grid */}
              {prorektors.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 auto-rows-fr">
                  {prorektors.map((prorektor) => (
                    <div key={prorektor.id} className={prorektorCardClass}>
                      <div className="w-full xl:w-[180px] shrink-0 self-start">
                        <div className="w-[180px] xl:w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white overflow-hidden">
                          <img
                            src={prorektor.photo}
                            alt={prorektor.fullName}
                            className="w-full h-full object-cover rounded-xl object-top"
                            onError={(e) => { e.target.onerror = null; e.target.src = rektorImg; }}
                          />
                        </div>
                      </div>

                      <div className="w-full flex flex-col justify-start flex-1">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
                            {prorektor.positionTitle}
                          </span>
                          <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                            {prorektor.fullName}
                          </h3>
                        </div>

                        <div className="space-y-2 sm:space-y-3 text-slate-500 font-medium text-[13px] sm:text-[14px]">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                            <span className="text-left">{prorektor.address}</span>
                          </div>
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                            <span className="text-left">{prorektor.receptionTime}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                            <a href={`mailto:${prorektor.email}`} className="hover:text-[#3b82f6] transition-colors break-all text-left">{prorektor.email}</a>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Phone className="w-4 h-4 text-[#3b82f6] shrink-0" />
                            <a href={`tel:${prorektor.phoneNumber}`} className="hover:text-[#3b82f6] transition-colors text-left">{prorektor.phoneNumber}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}


