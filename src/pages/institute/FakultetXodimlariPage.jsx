import React from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { HiOutlineMail } from 'react-icons/hi'
import { GrSend } from 'react-icons/gr'
import { Link } from 'react-router-dom'
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

export default function FakultetXodimlariPage() {
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
                  <Link to="/fakultetlar" className="hover:text-white transition-colors">
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
          
          {/* Fakultet dekani Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 text-[18px] sm:text-[20px]">
            Fakultet dekani
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
                  alt="Davlatmuratov Valijon"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col h-full w-full">
              <div className="mb-6 mt-2 text-center md:text-left pr-0 md:pr-[120px]">
                <h3 className="text-[20px] md:text-[24px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                  DAVLATMURATOV VALIJON
                </h3>
                <p className="text-slate-600 mt-2 text-[14px] md:text-[15px] font-medium">
                  Falsafa doktori (PhD), Dotsent
                </p>
              </div>

              {/* Contact Info Grid */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-4">
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DeskPhoneIcon size={18} /> Telefon raqam:
                  </div>
                  <div className="text-slate-700 font-semibold">+998 94 237 03 73</div>
                </div>
                <div>
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HiOutlineMail size={20} /> Elektron pochta:
                  </div>
                  <div className="text-slate-700 font-semibold">sss999@gmail.com</div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <Link to="#" className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors duration-300 w-full sm:w-auto">
                  Batafsil <ArrowRight size={16} />
                </Link>
                <Link to="#" className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0056b3] text-white hover:bg-[#004494] font-semibold transition-colors duration-300 w-full sm:w-auto shadow-sm">
                  <GrSend size={18} />
                  Dekanga murojaat yo'llash
                </Link>
              </div>
            </div>
          </div>

          {/* Dekan o'rinbosarlari Section */}
          <div className="bg-white rounded-xl py-4 px-6 shadow-sm border border-slate-200 text-center font-bold text-[#0c1f4a] mb-6 mt-12 text-[18px] sm:text-[20px]">
            Dekan o'rinbosarlari
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {/* O'rinbosar 1 */}
            <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-start p-5 gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="w-[150px] sm:w-[180px] shrink-0 mx-auto sm:mx-0">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={menImg} alt="Davlatmuratov Valijon" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex-1 flex flex-col w-full h-full">
                <div className="mb-4">
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                    DAVLATMURATOV VALIJON
                  </h4>
                  <p className="text-slate-600 mt-2 text-[13px] sm:text-[14px]">
                    Falsafa doktori (PhD), Dotsent
                  </p>
                </div>
                <div className="mb-3">
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1">Lavozimi:</div>
                  <div className="text-slate-700 text-[14px] leading-snug">O'quv ishlari bo'yicha dekan o'rinbosari</div>
                </div>
                <div className="mb-6">
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DeskPhoneIcon size={18} /> Telefon raqam:
                  </div>
                  <div className="text-slate-700 text-[14px] font-semibold">+998 94 237 03 73</div>
                </div>
                <div className="mt-auto">
                  <Link to="#" className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors duration-300">
                    Batafsil <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* O'rinbosar 2 */}
            <div className="w-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row items-start p-5 gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="w-[150px] sm:w-[180px] shrink-0 mx-auto sm:mx-0">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={menImg} alt="Davlatmuratov Valijon" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="flex-1 flex flex-col w-full h-full">
                <div className="mb-4">
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                    DAVLATMURATOV VALIJON
                  </h4>
                  <p className="text-slate-600 mt-2 text-[13px] sm:text-[14px]">
                    Magistr
                  </p>
                </div>
                <div className="mb-3">
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1">Lavozimi:</div>
                  <div className="text-slate-700 text-[14px] leading-snug">Yoshlar masalalari, ma'naviyat va ma'rifat ishlari bo'yicha dekan o'rinbosari</div>
                </div>
                <div className="mb-6">
                  <div className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DeskPhoneIcon size={18} /> Telefon raqam:
                  </div>
                  <div className="text-slate-700 text-[14px] font-semibold">+998 94 237 03 73</div>
                </div>
                <div className="mt-auto">
                  <Link to="#" className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold transition-colors duration-300">
                    Batafsil <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
