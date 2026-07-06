import React from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { GrSend } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import menImg from '../assets/men.jpg'
import placeholderImg from '../assets/images/bg23.jpg' // Use as fallback for other staff

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

const StaffCard = ({ name, degree, position, img }) => (
  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden p-3 pb-0">
      <img src={img} alt={name} className="w-full h-full object-cover object-top rounded-t-lg" />
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
        <Link to="#" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-medium text-[13px] transition-colors duration-300">
          Batafsil <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
)

export default function KafedraXodimlariPage() {
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
                  <Link to="/kafedralar" className="hover:text-white transition-colors">
                    Kafedralar
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">Kafedra xodimlari</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Kafedra mudiri Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
            Kafedra mudiri
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
                  alt="Mudir"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col h-full w-full">
              <div className="mb-6 mt-2 text-center md:text-left pr-0 md:pr-[120px]">
                <h3 className="text-[20px] md:text-[24px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                  ABDULLAYEV ALISHER
                </h3>
                <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                  Kafedra mudiri, Dotsent
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
                  <div className="text-slate-700 font-semibold">alisher.a@gmail.com</div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4 border-t border-slate-100 pt-6">
                <Link to="#" className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-[#0c1f4a] text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white font-semibold transition-colors duration-300 w-full sm:w-auto">
                  Batafsil <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Kafedra xodimlari Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 mt-12 text-[18px] sm:text-[20px]">
            Kafedra xodimlari
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaffCard 
              name="BAXTIYOROV SARDOR"
              degree="Falsafa doktori (PhD)"
              position="Katta o'qituvchi"
              img={menImg}
            />
            <StaffCard 
              name="JALOLOV RUSTAM"
              degree="Falsafa doktori (PhD)"
              position="O'qituvchi"
              img={menImg}
            />
            <StaffCard 
              name="YUSUPOV NODIR"
              degree="Falsafa doktori (PhD)"
              position="Katta o'qituvchi"
              img={menImg}
            />
            <StaffCard 
              name="KARIMOV AZIZ"
              degree="Magistr"
              position="Assistent"
              img={menImg}
            />
            <StaffCard 
              name="XOLMATOV ELDOR"
              degree="Falsafa doktori (PhD)"
              position="Dotsent"
              img={menImg}
            />
            <StaffCard 
              name="RAHIMOV BOTIR"
              degree="Falsafa doktori (PhD)"
              position="Katta o'qituvchi"
              img={menImg}
            />
            <StaffCard 
              name="TOSHEV QODIR"
              degree="Magistr"
              position="O'qituvchi"
              img={menImg}
            />
            <StaffCard 
              name="USMONOV ALISHER"
              degree="Magistr"
              position="Stajyor-o'qituvchi"
              img={menImg}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
