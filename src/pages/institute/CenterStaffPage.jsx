import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import menImg from '../../assets/men.jpg'
import { employeesAPI, centersAPI, getFileUrl, localizedField, positionsAPI, resolvePersonPosition } from '../../api'

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

const StaffCard = ({ id, name, position, phone, img, lang = 'uz' }) => (
  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden p-3 pb-0">
      <img 
        src={img || menImg} 
        alt={name} 
        className="w-full h-full object-cover object-top rounded-t-lg" 
        onError={(e) => { e.target.onerror = null; e.target.src = menImg; }} 
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h4 className="text-[13px] md:text-[14px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-snug mb-2">
        {name}
      </h4>
      <p className="text-slate-600 text-[13px] mb-6 font-medium leading-snug">
        {position}
      </p>
      
      <div className="mt-auto">
        <Link 
          to={`/employee/${id}?type=employee`} 
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-medium text-[13px] transition-colors duration-300"
        >
          {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'More details' : 'Batafsil'} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);

export default function CenterStaffPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'uz';

  const [staffList, setStaffList] = useState([]);
  const [centerData, setCenterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractArray = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.content)) return payload.content;
    if (Array.isArray(payload.data?.content)) return payload.data.content;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.result)) return payload.result;
    return [];
  };

  useEffect(() => {
    let isMounted = true;
    
    const normalizeStr = (str) => {
      if (!str) return '';
      return String(str)
        .toLowerCase()
        .replace(/[\u02BC\u2019\u2018\u02BB`']/g, "'")
        .replace(/g['`ʼ’]/g, 'g')
        .replace(/o['`ʼ’]/g, 'o')
        .replace(/sh/g, 's')
        .replace(/ch/g, 'c')
        .replace(/bo'limi|markazi|bo'lim|markaz|department|center/gi, '')
        .replace(/[^a-z0-9а-я]/gi, '')
        .trim();
    };

    const fetchCenterAndEmployees = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const promises = [
          centersAPI.getLandingById(id, lang),
          centersAPI.getById(id),
          centersAPI.getLanding(0, 100, lang),
          centersAPI.getAll(lang),
          employeesAPI.getLandingByCenter(id, 0, 100, lang),
          employeesAPI.getByCenter(id, lang),
          employeesAPI.getLanding(0, 100),
          employeesAPI.getAll(lang),
          positionsAPI.getAll()
        ];

        const [
          centerLandingByIdRes,
          centerByIdRes,
          centerLandingRes,
          centerAllRes,
          empLandingByCenterRes,
          empByCenterRes,
          empLandingRes,
          empAllRes,
          posRes
        ] = await Promise.allSettled(promises);

        // Resolve Center Data
        let foundCenter = null;
        const unwrapCenter = (payload) => {
          if (!payload) return null;
          if (payload.data && !Array.isArray(payload.data) && (payload.data.id || payload.data.name || payload.data.nameUz)) {
            return payload.data;
          }
          return payload.id ? payload : null;
        };
        const hasCenterName = (c) => Boolean(c?.nameUz || c?.name || c?.title);
        if (centerLandingByIdRes.status === 'fulfilled') {
          foundCenter = unwrapCenter(centerLandingByIdRes.value);
        }
        if ((!foundCenter || !hasCenterName(foundCenter)) && centerByIdRes.status === 'fulfilled' && centerByIdRes.value) {
          foundCenter = unwrapCenter(centerByIdRes.value) || foundCenter;
        }
        if (!foundCenter || !hasCenterName(foundCenter)) {
          const landingCenters = centerLandingRes.status === 'fulfilled' ? extractArray(centerLandingRes.value) : [];
          const allCenters = centerAllRes.status === 'fulfilled' ? extractArray(centerAllRes.value) : [];
          foundCenter = [...landingCenters, ...allCenters].find(c => String(c.id) === String(id)) || foundCenter;
        }

        if (isMounted && foundCenter) {
          setCenterData({
            ...foundCenter,
            title: localizedField(foundCenter, 'name', lang, foundCenter.nameUz || foundCenter.title || "Bo'lim / Markaz"),
            description: localizedField(foundCenter, 'description', lang, foundCenter.descriptionUz || foundCenter.description || ""),
            headName: foundCenter.headName || foundCenter.leaderName || foundCenter.headFullName || "",
            headId: foundCenter.headId || foundCenter.leaderId || null,
            headPhoto: foundCenter.headPhoto || foundCenter.leaderPhoto || foundCenter.photoLink || foundCenter.photo || null,
            phone: foundCenter.phone || foundCenter.phoneNumber || "",
            email: foundCenter.email || "",
            receptionHours: foundCenter.receptionHours || "09:00 - 17:00",
            tasks: Array.isArray(foundCenter.tasks) ? foundCenter.tasks : []
          });
        }

        // Resolve Employees
        const listLandingByCenter = empLandingByCenterRes.status === 'fulfilled' ? extractArray(empLandingByCenterRes.value) : [];
        const listByCenter = empByCenterRes.status === 'fulfilled' ? extractArray(empByCenterRes.value) : [];
        const listLanding = empLandingRes.status === 'fulfilled' ? extractArray(empLandingRes.value) : [];
        const listAll = empAllRes.status === 'fulfilled' ? extractArray(empAllRes.value) : [];
        const positions = posRes.status === 'fulfilled' ? extractArray(posRes.value) : [];

        const combinedMap = new Map();
        [...listLandingByCenter, ...listByCenter, ...listLanding, ...listAll].forEach(item => {
          if (item && item.id != null) {
            const isDirectCenterItem =
              listLandingByCenter.some(c => String(c.id) === String(item.id)) ||
              listByCenter.some(c => String(c.id) === String(item.id));
            combinedMap.set(String(item.id), { ...item, isDirectCenterItem });
          }
        });
        const apiEmps = Array.from(combinedMap.values());

        const centerTitleClean = normalizeStr(foundCenter?.nameUz || foundCenter?.name || foundCenter?.title || '');

        let formattedEmps = apiEmps.map(e => {
          const posId = e.positionId || e.position?.id;
          const nestedPos = (e.position && typeof e.position === 'object') ? e.position : null;
          const posObj = (nestedPos && (nestedPos.nameUz || nestedPos.name || nestedPos.nameRu || nestedPos.nameEn))
            ? nestedPos
            : (positions.find(p => String(p.id) === String(posId)) || nestedPos);
          
          const person = { ...e, position: posObj || e.position };
          const posTitle = resolvePersonPosition(person, lang, localizedField(e, 'positionTitle', lang, e.positionTitleUz || e.positionTitle || "Xodim"));

          return {
            id: e.id,
            name: localizedField(e, 'fullName', lang, e.fullNameUz || e.fullName || "Xodim"),
            position: posTitle,
            phone: e.phoneNumber || e.phone || "+998 90 123 45 67",
            email: e.email || "info@urspi.uz",
            img: getFileUrl(e.photoLink || e.photo || e.image) || menImg,
            centerId: e.centerId || e.center?.id,
            centerName: typeof e.centerName === 'string' ? e.centerName : (typeof e.center === 'string' ? e.center : (e.center?.nameUz || e.center?.name)),
            raw: person
          };
        });

        // Filter employees belonging to this center
        formattedEmps = formattedEmps.filter(e => {
          if (e.raw?.isDirectCenterItem) return true;
          const empCenterId = String(e.centerId || e.raw?.centerId || e.raw?.center?.id || '');
          if (empCenterId && String(id) === empCenterId) return true;

          const empCenterNameClean = normalizeStr(e.centerName);
          if (centerTitleClean && empCenterNameClean && (
            empCenterNameClean.includes(centerTitleClean) || centerTitleClean.includes(empCenterNameClean)
          )) {
            return true;
          }
          return false;
        });

        if (isMounted) {
          setStaffList(formattedEmps);
        }
      } catch (err) {
        console.warn('Failed to load center details/employees:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCenterAndEmployees();
    return () => { isMounted = false; };
  }, [id, lang]);

  // Determine Head of Center
  let headMember = null;

  if (centerData?.headName) {
    headMember = {
      id: centerData.headId || 'head',
      name: centerData.headName,
      position: lang === 'ru' ? "Начальник отдела" : lang === 'en' ? "Head of Department" : "Bo'lim boshlig'i",
      phone: centerData.phone || "+998 90 123 45 67",
      email: centerData.email || "info@urspi.uz",
      img: getFileUrl(centerData.headPhoto) || menImg,
      receptionHours: centerData.receptionHours || "09:00 - 17:00"
    };
  } else {
    // Search in staffList for head / boss title
    const foundHead = staffList.find(e => {
      const posStr = String(e.position || e.raw?.positionTitleUz || '').toLowerCase();
      return /boshliq|boshlig|boshlig'i|rahbar|head|dir|direktor|мудир|начальник/i.test(posStr);
    }) || (staffList.length > 0 ? staffList[0] : null);

    if (foundHead) {
      headMember = foundHead;
    }
  }

  const otherStaffList = headMember
    ? staffList.filter(e => String(e.id) !== String(headMember.id))
    : staffList;

  const centerTitle = centerData?.title || "Markaz / Bo'lim";
  const centerDesc = centerData?.description || "";

  const taskList = (centerData?.tasks && centerData.tasks.length > 0) ? centerData.tasks : [
    "Institutdagi barcha ta'lim va boshqaruv jarayonlarini samarali muvofiqlashtirish.",
    "O'quv va tashkiliy faoliyatda zamonaviy metodlar va texnologiyalarni tatbiq etish.",
    "Talabalar hamda professor-o'qituvchilarga sifatli xizmat ko'rsatish.",
    "Me'yoriy hujjatlar va davlat ta'lim standartlari talablariga rioya etilishini ta'minlash.",
    "Soha bo'yicha hisobotlar hamda statistik tahlillarni tayyorlash.",
    "Innovatsion va samador loyihalarni ishlab chiqish hamda joriy qilish."
  ];

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
                  <Link to="/centers" className="hover:text-white transition-colors">
                    {t('common.centers')}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">{centerTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Bo'lim nomi */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0c1f4a] uppercase">
              {centerTitle}
            </h1>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium">Yuklanmoqda...</div>
          ) : (
            <>
              {/* Bo'lim boshlig'i Section */}
              {headMember && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Начальник отдела' : lang === 'en' ? 'Head of Department' : "Bo'lim boshlig'i"}
                  </div>

                  <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-5 md:p-6 gap-6 relative mb-12">
                    
                    {/* Top Right Badge (Qabul vaqtlari) */}
                    {(headMember.receptionHours || centerData?.receptionHours) && (
                      <div className="absolute top-5 right-6 hidden md:block bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-right border border-blue-100">
                        <div className="text-[12px] font-medium opacity-80">
                          {lang === 'ru' ? 'Часы приема:' : lang === 'en' ? 'Reception hours:' : 'Qabul vaqtlari:'}
                        </div>
                        <div className="font-bold text-[14px]">{headMember.receptionHours || centerData?.receptionHours}</div>
                      </div>
                    )}

                    {/* Left Image */}
                    <div className="w-[180px] md:w-[220px] shrink-0 mx-auto md:mx-0">
                      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img
                          src={headMember.img || menImg}
                          alt={headMember.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.onerror = null; e.target.src = menImg; }}
                        />
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col h-full w-full">
                      <div className="mb-6 mt-2 text-center md:text-left pr-0 md:pr-[120px]">
                        <h3 className="text-[20px] md:text-[24px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                          {headMember.name}
                        </h3>
                        <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                          {headMember.position || (lang === 'ru' ? 'Начальник отдела' : lang === 'en' ? 'Head of Department' : "Bo'lim boshlig'i")}
                        </p>
                      </div>

                      {/* Contact Info Grid */}
                      {(headMember.phone || headMember.email) && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                          {headMember.phone && (
                            <div>
                              <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <DeskPhoneIcon size={18} /> {lang === 'ru' ? 'Телефон:' : lang === 'en' ? 'Phone:' : 'Telefon raqam:'}
                              </div>
                              <div className="text-slate-700 font-semibold">{headMember.phone}</div>
                            </div>
                          )}
                          {headMember.email && (
                            <div>
                              <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <HiOutlineMail size={20} /> {lang === 'ru' ? 'Эл. почта:' : lang === 'en' ? 'Email:' : 'Elektron pochta:'}
                              </div>
                              <div className="text-slate-700 font-semibold">{headMember.email}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Buttons */}
                      {headMember.id && headMember.id !== 'head' && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4 border-t border-slate-100 pt-6">
                          <Link 
                            to={`/employee/${headMember.id}?type=employee`} 
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-semibold transition-colors duration-300 w-full sm:w-auto"
                          >
                            {lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'More details' : 'Batafsil'} <ArrowRight size={16} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Bo'lim xodimlari Section */}
              {otherStaffList.length > 0 && (
                <>
                  <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 mt-8 text-[18px] sm:text-[20px]">
                    {lang === 'ru' ? 'Сотрудники отдела' : lang === 'en' ? 'Department Staff' : "Bo'lim xodimlari"}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {otherStaffList.map((member) => (
                      <StaffCard 
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        position={member.position}
                        phone={member.phone}
                        img={member.img}
                        lang={lang}
                      />
                    ))}
                  </div>
                </>
              )}

              {!headMember && otherStaffList.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-medium">
                  {lang === 'ru' ? 'Сотрудники пока не добавлены' : lang === 'en' ? 'No staff added yet' : "Xodimlar haqli ma'lumotlar hozircha yo'q"}
                </div>
              )}

              {/* Bo'lim maqsadi Section */}
              <div className="mt-16 mb-6">
                <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">
                  {lang === 'ru' ? 'Цель отдела' : lang === 'en' ? 'Department Goal' : "Bo'lim maqsadi"}
                </h2>
                <div className="bg-slate-100 rounded-xl p-8 text-center relative shadow-sm">
                  <div className="text-[#0c1f4a]/20 text-7xl font-serif leading-none h-10 overflow-visible mx-auto mb-2 select-none">“</div>
                  <p className="text-slate-700 text-[15px] relative z-10 leading-relaxed max-w-4xl mx-auto font-medium">
                    {centerDesc || "Bo'limning asosiy maqsadi — institutda o'z yo'nalishi bo'yicha ta'lim va boshqaruv jarayonlarini samarali tashkil etish va muvofiqlashtirishdir."}
                  </p>
                </div>
              </div>

              {/* Bo'lim vazifalari Section */}
              <div className="mt-16 mb-10">
                <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">
                  {lang === 'ru' ? 'Задачи отдела' : lang === 'en' ? 'Department Tasks' : "Bo'lim vazifalari"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {taskList.map((task, index) => (
                    <div key={index} className="group bg-white rounded-xl p-6 border border-slate-200 text-center shadow-sm hover:shadow-xl hover:border-[#0c1f4a]/30 hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                      <div className="w-12 h-12 bg-slate-100 text-[#0c1f4a] group-hover:bg-[#0c1f4a] group-hover:text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-colors duration-300">
                        {index + 1}
                      </div>
                      <p className="text-slate-600 group-hover:text-slate-800 text-[14px] leading-relaxed transition-colors duration-300">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
