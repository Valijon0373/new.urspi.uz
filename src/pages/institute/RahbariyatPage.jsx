import React from 'react'
import { MapPin, Mail, Clock, Phone, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import rektorImg from '../../assets/men.jpg'

const prorektorCardClass =
  'w-full h-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col xl:flex-row items-start p-5 gap-5 xl:gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/60 hover:-translate-y-0.5'

export default function RahbariyatPage() {
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
                  <span className="text-white font-medium">Rahbariyat</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">

          {/* Card — Rektor */}
          <div className="w-full max-w-5xl mx-auto bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row p-5 md:p-7 gap-6 md:gap-10 transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/60 hover:-translate-y-0.5">

            {/* Left: Image Frame */}
            <div className="w-full md:w-[260px] shrink-0">
              <div className="w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={rektorImg}
                  alt="Abdullayev Diyorjon"
                  className="w-full h-full object-cover rounded-xl object-top"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full flex flex-col justify-center py-2">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[13px] font-semibold mb-3">
                  Rektor v.b
                </span>
                <h2 className="text-[26px] md:text-[32px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                  ABDULLAYEV DIYORJON
                </h2>
              </div>

              <div className="space-y-4 text-slate-500 font-medium">

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                  <span className="text-base">Xorazm viloyati, Urganch shahri, Gurlan ko'chasi 1A-uy</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <span className="text-base">Seshanba, Juma 14:00 - 16:00</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <a href="mailto:adn20@mail.ru" className="text-base hover:text-[#3b82f6] transition-colors">adn20@mail.ru</a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <a href="tel:+998622261840" className="text-base hover:text-[#3b82f6] transition-colors">+998622261840</a>
                </div>

              </div>
            </div>
          </div>

          {/* Prorektors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 auto-rows-fr">

              {/* Prorektor 1 */}
              <div className={prorektorCardClass}>
                <div className="w-full xl:w-[180px] shrink-0 self-start">
                  <div className="w-[180px] xl:w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white overflow-hidden">
                    <img
                      src={rektorImg}
                      alt="Allanazarov Sirojbek Bekchan o‘g‘li"
                      className="w-full h-full object-cover rounded-xl object-top"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
                      O‘quv ishlari bo‘yicha prorektor
                    </span>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                      ALLANAZAROV SIROJBEK
                    </h3>
                    <p className="text-[#0c1f4a] font-medium text-[14px] sm:text-[15px] mt-1">Bekchan o‘g‘li</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-500 font-medium text-[13px] sm:text-[14px]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Xorazm viloyati, Urganch shahri, Gurlan ko'chasi 1A-uy</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Dushanba 10:00 - 12:00, Payshanba 14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="mailto:allanazarov_sirojbek@gmail.com" className="hover:text-[#3b82f6] transition-colors break-all text-left">allanazarov_sirojbek@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="tel:+998993473605" className="hover:text-[#3b82f6] transition-colors text-left">+998993473605</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prorektor 3 */}
              <div className={prorektorCardClass}>
                <div className="w-full xl:w-[180px] shrink-0 self-start">
                  <div className="w-[180px] xl:w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white overflow-hidden">
                    <img
                      src={rektorImg}
                      alt="Latipov Xursandbek Durdiboy o‘g‘li"
                      className="w-full h-full object-cover rounded-xl object-top"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
                      Moliya-iqtisod ishlari boʻyicha prorektor
                    </span>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                      LATIPOV XURSANDBEK
                    </h3>
                    <p className="text-[#0c1f4a] font-medium text-[14px] sm:text-[15px] mt-1">Durdiboy o‘g‘li</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-500 font-medium text-[13px] sm:text-[14px]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Xorazm viloyati, Urganch shahri, Gurlan ko'chasi 1A-uy</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Dushanba, Shanba 14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="mailto:latipov_x@gmail.ru" className="hover:text-[#3b82f6] transition-colors break-all text-left">latipov_x@gmail.ru</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="tel:+998999614388" className="hover:text-[#3b82f6] transition-colors text-left">+998 99 961 43 88</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prorektor 2 */}
              <div className={prorektorCardClass}>
                <div className="w-full xl:w-[180px] shrink-0 self-start">
                  <div className="w-[180px] xl:w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white overflow-hidden">
                    <img
                      src={rektorImg}
                      alt="Xo‘jamuratov Umarjon Rustamovich"
                      className="w-full h-full object-cover rounded-xl object-top"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
                      Yoshlar masalalari va ma’naviy-marifiy ishlar bo‘yicha birinchi prorektori
                    </span>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                      XO‘JAMURATOV UMARJON
                    </h3>
                    <p className="text-[#0c1f4a] font-medium text-[14px] sm:text-[15px] mt-1">Rustamovich</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-500 font-medium text-[13px] sm:text-[14px]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Xorazm viloyati, Urganch shahri, Gurlan ko'chasi 1A-uy</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Dushanba 10:00 - 12:00, Payshanba 14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="mailto:umarjonbuyuk@gmail.com" className="hover:text-[#3b82f6] transition-colors break-all text-left">umarjonbuyuk@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="tel:+998942307338" className="hover:text-[#3b82f6] transition-colors text-left">+998942307338</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prorektor 4 */}
              <div className={prorektorCardClass}>
                <div className="w-full xl:w-[180px] shrink-0 self-start">
                  <div className="w-[180px] xl:w-full aspect-[4/5] rounded-2xl border-[3px] border-[#0c1f4a] p-1 bg-white overflow-hidden">
                    <img
                      src={rektorImg}
                      alt="Kamilоva Nazоkat Saidjоnоvna"
                      className="w-full h-full object-cover rounded-xl object-top"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-start flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
                      Axborot masalalari bo'yicha rektor maslahatchisi
                    </span>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
                      KAMILОVA NAZОKAT
                    </h3>
                    <p className="text-[#0c1f4a] font-medium text-[14px] sm:text-[15px] mt-1">Saidjоnоvna</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 text-slate-500 font-medium text-[13px] sm:text-[14px]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Xorazm viloyati, Urganch shahri, Gurlan ko'chasi 1A-uy</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                      <span className="text-left">Seshanba, Juma 14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="mailto:nazokat4826@gmail.com" className="hover:text-[#3b82f6] transition-colors break-all text-left">nazokat4826@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 text-[#3b82f6] shrink-0" />
                      <a href="tel:+998954404826" className="hover:text-[#3b82f6] transition-colors text-left">+998954404826</a>
                    </div>
                  </div>
                </div>
              </div>

          </div>

        </div>
      </div>
    </div>
  )
}
