import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/images/logo1.jpg' // Use generic logo

export default function FakultetDetailPage() {
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
                  <span className="text-white font-medium">Fakultet tarixi</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 md:p-12 relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-10 relative z-10">
              <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white ring-4 ring-blue-50 bg-white">
                <img src={logoImg} alt="Institut logotipi" className="w-full h-full object-cover object-center" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#0c1f4a] uppercase tracking-tight leading-tight mt-2">
                PEDAGOGIKA FAKULTETI TARIXI
              </h1>
              <div className="w-24 h-1.5 bg-[#3b82f6] rounded-full mt-6"></div>
            </div>

            {/* History Content */}
            <div className="prose max-w-none text-slate-700 leading-relaxed space-y-5 text-[15px] sm:text-[16px] text-justify relative z-10">
              <p>
                O‘zbekiston Respublikasi Prezidentining 2022 yil 21-iyundagi “Pedagogik ta'lim sifatini oshirish va pedagog kadrlar tayyorlovchi oliy ta'lim muassasalari faoliyatini yanada rivojlantirish chora-tadbirlari to'g'risida"gi PQ-289-sonli qaroriga asosan Urganch davlat universiteti pedagogika ta'lim sohasining bakalavriat ta'lim yo'nalishi va magistratura mutaxassisliklari negizida Urganch davlat pedagogika instituti tashkil etildi. Institut tarkibida Pedagogika fakulteti tashkil topdi.
              </p>
              <p>
                Fakultet – institutining tarkibiy tuzilmasi hisoblanadi. Uning faoliyati tegishli ta'lim yo'nalishlari va mutaxassisliklari bo'yicha talabalarni o'qitish, ta'lim-tarbiya jarayonlarini uzviy hamda uyg'unlashgan xolda olib borish, shuningdek, kafedralarda ilmiy tadqiqot loyihalarini bajarish ishlarini muvofiqlashtirishga yo'naltiriladi. Fakultet tarkibiy tuzilmasida fakultet Kengashi hamda o'quv-uslubiy kengash faoliyat olib boradi. Fakultet oliy ta'limning asosiy va qo'shimcha ta'lim dasturlarini bajarish bo'yicha ta'lim faoliyati bilan shug'ullanadi. Fakultet o'z nomi yozilgan shtampga va boshqa rekvizitlarga ega.
              </p>
              <p>
                Fakultet internet tizimida institutning rasmiy <strong><a href="https://urspi.uz" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">www.UrSPI.uz</a></strong> saytida o'z bo'limiga ega. Fakultet joylashgan manzil: 220100, Urganch shahar, Gurlan ko'chasi, 1 A-uy.
              </p>
            </div>

            {/* Directions Box */}
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 relative z-10 shadow-sm">
              <h2 className="text-[18px] sm:text-xl font-bold text-[#0c1f4a] mb-8 uppercase text-center flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-slate-300 hidden sm:block"></span>
                FAKULTETDA MAVJUD TA'LIM YO'NALISHLARI
                <span className="w-8 h-px bg-slate-300 hidden sm:block"></span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bakalavriat */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b82f6] flex items-center justify-center font-bold text-lg">B</div>
                    <h3 className="font-bold text-[#0c1f4a] text-[16px] uppercase tracking-wide">
                      Bakalavriat yo'nalishi
                    </h3>
                  </div>
                  <ul className="space-y-3 text-slate-700 text-[14px] sm:text-[15px]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-1"><ChevronRight size={16} /></span>
                      <span><span className="font-bold text-[#0c1f4a]">6010100</span> – Pedagogika</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-1"><ChevronRight size={16} /></span>
                      <span><span className="font-bold text-[#0c1f4a]">60110200</span> – Maktabgacha ta'lim</span>
                    </li>
                  </ul>
                </div>

                {/* Magistratura */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b82f6] flex items-center justify-center font-bold text-lg">M</div>
                    <h3 className="font-bold text-[#0c1f4a] text-[16px] uppercase tracking-wide">
                      Magistratura yo'nalishi
                    </h3>
                  </div>
                  <ul className="space-y-3 text-slate-700 text-[14px] sm:text-[15px]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-1"><ChevronRight size={16} /></span>
                      <span><span className="font-bold text-[#0c1f4a]">70110101</span> – Pedagogika nazariyasi va tarixi (faoliyat turi bo'yicha)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3b82f6] mt-1"><ChevronRight size={16} /></span>
                      <span><span className="font-bold text-[#0c1f4a]">70110201</span> – Ta'lim va tarbiya nazariyasi va metodikasi (maktabgacha ta'lim)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
