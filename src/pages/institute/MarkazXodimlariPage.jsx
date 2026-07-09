import React from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { GrSend } from 'react-icons/gr'
import { Link, useParams } from 'react-router-dom'
import { centers } from './MarkazlarPage'
import menImg from '../../assets/men.jpg'
import placeholderImg from '../../assets/images/bg23.jpg' // Use as fallback for other staff

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

const StaffCard = ({ id = '1', name, phone, position, img }) => (
  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden p-3 pb-0">
      <img src={img} alt={name} className="w-full h-full object-cover object-top rounded-t-lg" />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h4 className="text-[13px] md:text-[14px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-snug mb-3">
        {name}
      </h4>
      <p className="text-slate-600 text-[13px] mb-6 font-medium leading-snug">
        {position}
      </p>
      
      <div className="mt-auto">
        <Link to={`/xodim/${id}`} className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-medium text-[13px] transition-colors duration-300">
          Batafsil <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
)

export default function MarkazXodimlariPage() {
  const { id } = useParams();
  const centerInfo = centers.find(c => c.id === parseInt(id));
  const centerTitle = centerInfo ? centerInfo.title : "Bo'lim nomi topilmadi";

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
              <div className="font-bold text-[14px]">10:00-18:00</div>
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
                  {centerInfo?.headName || "OBIDOV JAHONGIR"}
                </h3>
                <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                  Bo'lim boshlig'i
                </p>
              </div>

              {/* Contact Info Grid */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DeskPhoneIcon size={18} /> Telefon raqam:
                  </div>
                  <div className="text-slate-700 font-semibold">+998 90 123 45 67</div>
                </div>
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HiOutlineMail size={20} /> Elektron pochta:
                  </div>
                  <div className="text-slate-700 font-semibold">jahongir.o@gmail.com</div>
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
            <StaffCard 
              id="davlatmuratov"
              name="Davlatmuratov Valijon To'lqin o'g'li"
              position="Muxandis dasturchi 1- toifa"
              phone="+998 94 237 03 73"
              img={menImg}
            />
            <StaffCard 
              id="matyaqubov"
              name="Matyaqubov Odilbek O‘ktamovich"
              position="Muhandis-dasturchi 1-toifali"
              phone="+998 97 606 14 21"
              img={menImg}
            />
            <StaffCard 
              id="bobojonov"
              name="Bobojonov Ahmad Anvar o'g'li"
              position="Tarmoq administratori"
              phone="+998 93 745 06 15"
              img={menImg}
            />
            <StaffCard 
              id="jumaniyozov"
              name="Jumaniyozov Jahongir Polvonovich"
              position="Kontent menejer"
              phone="+998 99 745 91 20"
              img={menImg}
            />
            <StaffCard 
              id="baltabayev"
              name="Baltabayev Doniyor Marat o'g'li"
              position="Bo‘lim boshlig‘i"
              phone="+998 99 022 81 28"
              img={menImg}
            />
            <StaffCard 
              id="abdullayev"
              name="Abdullayev Otajon Otabek o'g'li"
              position="Tarmoq administratori"
              phone="+998 88 357 95 65"
              img={menImg}
            />
            <StaffCard 
              id="ismailov"
              name="Ismailov Umrbek Ravshanovich"
              position="Bo'lim boshlig'i"
              phone="+998 91 422 41 44"
              img={menImg}
            />
            <StaffCard 
              id="otaboyev"
              name="Otaboyev Akbar Ilxambek o`g`li"
              position="Muxandis dasturchi 1- toifa"
              phone="+998-97-221-88-96"
              img={menImg}
            />
          </div>

          {/* Bo'lim maqsadi Section */}
          <div className="mt-16 mb-6">
            <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">Bo'lim maqsadi</h2>
            <div className="bg-slate-100 rounded-xl p-8 text-center relative shadow-sm">
              <div className="text-[#0c1f4a]/20 text-7xl font-serif leading-none h-10 overflow-visible mx-auto mb-2 select-none">“</div>
              <p className="text-slate-700 text-[15px] relative z-10 leading-relaxed max-w-4xl mx-auto font-medium">
                Axborot texnologiyalari bo'limining asosiy maqsadi — institutda zamonaviy axborot-kommunikatsiya texnologiyalarini joriy etish, ta'lim va ilmiy jarayonlarni raqamlashtirish, samarali axborot tizimlarini yaratish hamda axborot xavfsizligini ta'minlashdir.
              </p>
            </div>
          </div>

          {/* Bo'lim vazifalari Section */}
          <div className="mt-16 mb-10">
            <h2 className="text-center font-bold text-[#0c1f4a] text-[18px] sm:text-[20px] mb-6">Bo'lim vazifalari</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Institutdagi barcha axborot tizimlari va tarmoqlarini samarali boshqarish.",
                "O'quv jarayonida zamonaviy texnologiyalarni keng qo'llash va elektron ta'lim tizimini rivojlantirish.",
                "Talabalar, professor-o'qituvchilar va xodimlarga axborot texnologiyalari bo'yicha texnik yordam ko'rsatish.",
                "Institutning rasmiy veb-sayti, elektron pochta va ichki platformalarini qo'llab-quvvatlash va yangilab borish.",
                "Axborot xavfsizligini ta'minlash, ma'lumotlarni himoya qilish va zaxiralash tizimlarini joriy etish.",
                "Innovatsion IT loyihalarni ishlab chiqish va ularni ta'lim hamda boshqaruv jarayoniga tatbiq etish."
              ].map((task, index) => (
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
