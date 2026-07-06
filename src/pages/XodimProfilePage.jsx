import React from 'react'
import { ChevronRight, Phone, Mail, User, Briefcase, GraduationCap, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import menImg from '../assets/men.jpg'

export const allStaff = [
  { id: '1', name: "MATSAPAYEV ODILBEK BAXTIYOR O'G'LI", position: "Markaz boshlig'i", phone: "+998 90 123 45 67", email: "odilbek.m@urspi.uz", bio: "Axborot texnologiyalari sohasida ko'p yillik tajribaga ega mutaxassis. Raqamli ta'lim tizimlarini joriy qilish va rivojlantirish bo'yicha qator loyihalar muallifi.", officeHours: "Dushanba - Juma: 10:00 - 16:00", img: menImg },
  { id: 'davlatmuratov', name: "Davlatmuratov Valijon To'lqin o'g'li", position: "Muxandis dasturchi 1- toifa", phone: "+998 94 237 03 73", email: "vdavlatmuratov@gmail.com", bio: "Institut axborot tizimlarini rivojlantirish va dasturiy ta'minot yaratish boyicha mutaxassis.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'matyaqubov', name: "Matyaqubov Odilbek O‘ktamovich", position: "Muhandis-dasturchi 1-toifali", phone: "+998 97 606 14 21", email: "Matyaqubov098@gmail.com", bio: "Institut axborot tizimlarini rivojlantirish va dasturiy ta'minot yaratish boyicha mutaxassis.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'bobojonov', name: "Bobojonov Ahmad Anvar o'g'li", position: "Tarmoq administratori", phone: "+998 93 745 06 15", email: "ahmadbobojonov2002@gmail.com", bio: "Institut lokal va global tarmoq infratuzilmasini boshqarish va xavfsizligini ta'minlash mutaxassisi.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'jumaniyozov', name: "Jumaniyozov Jahongir Polvonovich", position: "Kontent menejer", phone: "+998 99 745 91 20", email: "jjahongir@exp.com", bio: "Institut rasmiy veb-sayti va ijtimoiy tarmoqlaridagi sahifalarini yuritish bo'yicha mas'ul.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'baltabayev', name: "Baltabayev Doniyor Marat o'g'li", position: "Bo‘lim boshlig‘i", phone: "+998 99 022 81 28", email: "bdoniyor@exp.com", bio: "Bo'lim faoliyatini muvofiqlashtirish va axborot texnologiyalarini joriy etish mas'uli.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'abdullayev', name: "Abdullayev Otajon Otabek o'g'li", position: "Tarmoq administratori", phone: "+998 88 357 95 65", email: "otashabdullayev@gmail.com", bio: "Institut lokal va global tarmoq infratuzilmasini boshqarish va xavfsizligini ta'minlash mutaxassisi.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'ismailov', name: "Ismailov Umrbek Ravshanovich", position: "Bo'lim boshlig'i", phone: "+998 91 422 41 44", email: "umrbekismailov@inbox.ru", bio: "Bo'lim faoliyatini muvofiqlashtirish va axborot texnologiyalarini joriy etish mas'uli.", officeHours: "Dushanba - Juma: 09:00 - 17:00" },
  { id: 'otaboyev', name: "Otaboyev Akbar Ilxambek o`g`li", position: "Muxandis dasturchi 1- toifa", phone: "+998-97-221-88-96", email: "otaboevakbar96@gmail.com", bio: "Institut axborot tizimlarini rivojlantirish va dasturiy ta'minot yaratish boyicha mutaxassis.", officeHours: "Dushanba - Juma: 09:00 - 17:00" }
];

export default function XodimProfilePage() {
  const { id } = useParams()

  const foundStaff = allStaff.find(s => s.id === id);
  const employeeData = foundStaff || allStaff[0];

  const displayImg = employeeData.img || menImg;

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
                  <span className="text-white font-medium">Xodim profili</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 md:py-16 flex flex-col flex-grow">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-6 md:p-10 gap-8 lg:gap-12 relative">
            
            {/* Left Image Section */}
            <div className="w-full md:w-[320px] shrink-0 mx-auto md:mx-0">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
                <img
                  src={displayImg}
                  alt={employeeData.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Content Section */}
            <div className="flex-1 flex flex-col h-full w-full">
              
              <div className="mb-8 border-b border-slate-100 pb-6 text-center md:text-left">
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight mb-3">
                  {employeeData.name}
                </h1>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 mb-8">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Lavozim</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.position}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Elektron pochta</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Telefon raqami</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Qabul vaqtlari</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.officeHours}</div>
                  </div>
                </div>

              </div>

              {/* Bio Section */}
              <div className="mt-auto bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-[#0c1f4a] text-[16px] mb-3 flex items-center gap-2">
                  <User size={18} />
                  Qisqacha ma'lumot
                </h3>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {employeeData.bio}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
