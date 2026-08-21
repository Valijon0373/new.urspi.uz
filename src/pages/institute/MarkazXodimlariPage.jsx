import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowRight, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getStoredCenters } from '../../data/centersData'
import menImg from '../../assets/men.jpg'
import { employeesAPI, centersAPI, getFileUrl } from '../../api'

const StaffCard = ({ id = '1', name, phone, position, img }) => (
  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden p-3 pb-0">
      <img src={img || menImg} alt={name} className="w-full h-full object-cover object-top rounded-t-lg" onError={(e) => { e.target.onerror = null; e.target.src = menImg; }} />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h4 className="text-[13px] md:text-[14px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-snug mb-2">
        {name}
      </h4>
      <p className="text-slate-600 text-[13px] mb-4 font-medium leading-snug">
        {position}
      </p>
      
      {phone && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{phone}</span>
        </div>
      )}

      <div className="mt-auto">
        <Link to={`/xodim/${id}`} className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-medium text-[13px] transition-colors duration-300">
          Batafsil <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);

export default function MarkazXodimlariPage() {
  const { id } = useParams();
  const allCenters = getStoredCenters();
  const centerInfo = allCenters.find(c => c.id === parseInt(id));

  const [staffList, setStaffList] = useState([]);
  const [centerData, setCenterData] = useState(centerInfo);

  useEffect(() => {
    let isMounted = true;
    const fetchEmployees = async () => {
      if (!id) return;
      try {
        const [empRes, centerRes] = await Promise.allSettled([
          employeesAPI.getByCenter(id, 'uz'),
          centersAPI.getById(id)
        ]);

        if (isMounted && centerRes.status === 'fulfilled' && centerRes.value) {
          const c = centerRes.value.data || centerRes.value;
          setCenterData({
            ...centerInfo,
            title: c.nameUz || c.name || centerInfo?.title,
            description: c.descriptionUz || c.description || centerInfo?.description
          });
        }

        if (isMounted && empRes.status === 'fulfilled' && empRes.value) {
          const rawEmps = Array.isArray(empRes.value) ? empRes.value : (empRes.value?.data || []);
          const formatted = rawEmps.map(emp => ({
            id: emp.id,
            name: emp.fullName || emp.fullNameUz || "Xodim",
            position: emp.positionTitle || emp.positionTitleUz || "Xodim",
            phone: emp.phoneNumber || "",
            img: getFileUrl(emp.photoLink || emp.photo) || menImg
          }));
          setStaffList(formatted);
        } else if (isMounted) {
          setStaffList([]);
        }
      } catch (err) {
        console.warn('Failed to load center employees from API:', err.message);
        if (isMounted) setStaffList([]);
      }
    };

    fetchEmployees();
    return () => { isMounted = false; };
  }, [id]);

  const getTitle = (c) => {
    if (!c) return "Bo'lim nomi topilmadi";
    if (typeof c.title === 'string') return c.title;
    return c.title?.uz || c.title?.ru || c.title?.en || "Bo'lim nomi topilmadi";
  };

  const getDesc = (c) => {
    if (!c) return "";
    if (typeof c.description === 'string') return c.description;
    return c.description?.uz || c.description?.ru || c.description?.en || "";
  };

  const centerTitle = getTitle(centerData);
  const centerDesc = getDesc(centerData);

  const taskList = centerInfo?.tasks || [
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
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link to="/markazlar" className="hover:text-white transition-colors">
                    Markazlar va bo'limlar
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">Bo'lim xodimlari</span>
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

          {/* Bo'lim boshlig'i Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
            Bo'lim boshlig'i
          </div>

          <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-5 md:p-6 gap-6 relative">
            
            {/* Top Right Badge (Qabul vaqtlari) */}
            <div className="absolute top-5 right-6 hidden md:block bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-right border border-blue-100">
              <div className="text-[12px] font-medium opacity-80">Qabul vaqtlari:</div>
              <div className="font-bold text-[14px]">{centerInfo?.receptionHours || "09:00-17:00"}</div>
            </div>

            {/* Left Image */}
            <div className="w-[180px] md:w-[220px] shrink-0 mx-auto md:mx-0">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={menImg}
                  alt="Boshliq"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col h-full w-full">
              <div className="mb-6 mt-2 text-center md:text-left pr-0 md:pr-[120px]">
                <h3 className="text-[20px] md:text-[24px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                  {centerInfo?.headName || "BO'LIM BOSHLIG'I"}
                </h3>
                <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                  Bo'lim boshlig'i
                </p>
              </div>

              {/* Contact Info Grid */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    Telefon raqam:
                  </div>
                  <div className="text-slate-700 font-semibold">{centerInfo?.phone || "+998 62 224 81 00"}</div>
                </div>
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    Elektron pochta:
                  </div>
                  <div className="text-slate-700 font-semibold">{centerInfo?.email || "info@urspi.uz"}</div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4 border-t border-slate-100 pt-6">
                <Link to="/xodim/1" className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-semibold transition-colors duration-300 w-full sm:w-auto">
                  Batafsil <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Xodimlar Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 mt-12 text-[18px] sm:text-[20px]">
            Bo'lim xodimlari
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffList.map((member) => (
              <StaffCard 
                key={member.id}
                id={member.id}
                name={member.name}
                position={member.position}
                phone={member.phone}
                img={menImg}
              />
            ))}
          </div>

          {/* Bo'lim maqsadi Section */}
          <div className="mt-16 mb-6">
            <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">Bo'lim maqsadi</h2>
            <div className="bg-slate-100 rounded-xl p-8 text-center relative shadow-sm">
              <div className="text-[#0c1f4a]/20 text-7xl font-serif leading-none h-10 overflow-visible mx-auto mb-2 select-none">“</div>
              <p className="text-slate-700 text-[15px] relative z-10 leading-relaxed max-w-4xl mx-auto font-medium">
                {centerDesc || "Bo'limning asosiy maqsadi — institutda o'z yo'nalishi bo'yicha ta'lim va boshqaruv jarayonlarini samarali tashkil etish va muvofiqlashtirishdir."}
              </p>
            </div>
          </div>

          {/* Bo'lim vazifalari Section */}
          <div className="mt-16 mb-10">
            <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">Bo'lim vazifalari</h2>
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

        </div>
      </div>
    </div>
  )
}
