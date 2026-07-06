import React, { useState } from 'react'
import { ChevronRight, ChevronLeft, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const documents = [
  { id: 1, title: "O'zbekiston Respublikasida fuqarolarning vijdon erkinligini ta'minlash va diniy sohadagi davlat siyosati konsepsiyasini tasdiqlash to'g'risida.", type: "Hujjat", color: "bg-[#ff4d6d]" },
  { id: 2, title: "Iqtisodiy jinoyatlarga qarshi kurashish tizimi takomillashtirilishi munosabati bilan O'zbekiston Respublikasining ayrim qonun hujjatlariga o'zgartirish va qo'shimchalar kiritish to'g'risida.", type: "Hujjat", color: "bg-[#2185d0]" },
  { id: 3, title: "O'zbekiston Respublikasi Prezident Farmoni va qarorlari Iqtisodiyotda raqobatni rivojlantirish va xususiy sektorning rolini yana oshirish chora-tadbirlari to'g'risida.", type: "Hujjat", color: "bg-[#fbbd08]" },
  { id: 4, title: "Texnik reglamentlarni ishlab chiqish, ularni tasdiqlash, o'zgartirish va qo'shimchalar kiritish hamda bekor qilish tartibi to'g'risidagi nizomni tasdiqlash haqida.", type: "Hujjat", color: "bg-[#a333c8]" },
  { id: 5, title: "Mikromoliyalashtirish faoliyati takomillashtirilishi munosabati bilan O'zbekiston Respublikasining ayrim qonun hujjatlariga qo'shimcha va o'zgartirishlar kiritish to'g'risida.", type: "Hujjat", color: "bg-[#00b5ad]" },
  { id: 6, title: "Yo'l harakati xavfsizligi tizimi takomillashtirilishi munosabati bilan O'zbekiston Respublikasining Jinoyat, Jinoyat-protsessual kodekslariga hamda O'zbekiston Respublikasining Ma'muriy javobgarlik to'g'risidagi kodeksiga qo'shimcha va o'zgartirishlar kiritish haqida.", type: "Hujjat", color: "bg-[#ff4d6d]" },
  { id: 7, title: "Shaharsozlik faoliyatini geoaxborot bilan ta'minlash mexanizmini takomillashtirish chora-tadbirlari to'g'risida.", type: "Hujjat", color: "bg-[#2185d0]" },
  { id: 8, title: "Oliy ta'lim tizimida dual ta'limni tashkil etish chora-tadbirlari to'g'risida (14-son 16.01.2025-y).", type: "Hujjat", color: "bg-[#fbbd08]" },
  { id: 9, title: "Yoshlar siyosati va sport sohasida davlat boshqaruvi takomillashtirilganligi munosabati bilan O'zbekiston Respublikasi Prezidentining ayrim hujjatlariga o'zgartirish va qo'shimchalar kiritish to'g'risida (24.12.2024 yil PF-226-son).", type: "Hujjat", color: "bg-[#a333c8]" },
  { id: 10, title: "Jismoniy tarbiya o'qituvchilari (instruktor, kafedra mudirlari) faoliyati samaradorligini baholashning reyting tizimi to'g'risidagi nizomga o'zgartirishlar kiritish haqida (23.12.2024 yilda ro'yxatdan o'tkazilgan).", type: "Hujjat", color: "bg-[#00b5ad]" },
  { id: 11, title: "Oliy ta'lim muassasasi professor-o'qituvchilar tarkibining o'quv yuklamasi hamda o'quv-uslubiy, ilmiy-tadqiqot va \"Ustoz-shogird\" ishlarini belgilash qoidalarining 7-bandiga o'zgartirish kiritish haqida (3076-2-son 20.01.2025-y)", type: "Hujjat", color: "bg-[#ff4d6d]" },
  { id: 12, title: "Kosmik faoliyat to'g'risida", type: "Hujjat", color: "bg-[#2185d0]" },
  { id: 13, title: "Davlat sirlari to'g'risida", type: "Hujjat", color: "bg-[#fbbd08]" },
  { id: 14, title: "Kasbiy ta'lim tashkilotlari o'quvchilarining ishlab chiqarish amaliyotini tashkil etish tizimini yanada takomillashtirish chora-tadbirlari to'g'risida", type: "Hujjat", color: "bg-[#a333c8]" },
  { id: 15, title: "Organik va organik-mineral o'g'itlar xavfsizligi bo'yicha qo'shimcha talablar belgilanganligi munosabati bilan Vazirlar Mahkamasining «Organik mahsulotlar va xom ashyolar hamda organikmineral o'g'itlarning xavfsizligiga doir ayrim normativ-huquqiy hujjatlarni tasdiqlash to'g'risida» 2020-yil 18-noyabrdagi 729-son qaroriga o'zgartirish va qo'shimchalar kiritish haqida", type: "Hujjat", color: "bg-[#00b5ad]" },
  ...Array.from({ length: 13 }, (_, i) => ({
    id: 16 + i,
    title: `O'zbekiston Respublikasi Vazirlar Mahkamasining qo'shimcha qarori va nizomlari #${i + 1}`,
    type: "Hujjat",
    color: i % 3 === 0 ? "bg-[#ff4d6d]" : i % 3 === 1 ? "bg-[#2185d0]" : "bg-[#fbbd08]"
  }))
]

const DocumentCard = ({ number, title, type, color, onMoreClick }) => (
  <div className="bg-white rounded-t-[8px] rounded-b-sm overflow-hidden shadow-lg border-x border-t border-slate-200 flex flex-col h-full w-full relative z-0 transform transition-transform hover:-translate-y-2 hover:shadow-2xl mx-auto">
    <div className={`w-full h-[90px] ${color} relative border-b border-black/10 shrink-0`}>
       {/* Nomer ustida turishi uchun */}
       <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/25 text-white font-bold flex items-center justify-center text-sm backdrop-blur-md border border-white/30">
         {number}
       </div>
    </div>
    <div className="p-5 flex flex-col flex-grow bg-white">
      <h3 className="font-bold text-slate-800 text-[13px] md:text-[14px] leading-snug mb-2 flex-grow line-clamp-3" title={title}>
        {title}
      </h3>
      <p className="text-slate-500 text-[12px] mb-4 shrink-0">
        {type}
      </p>
      
      <div className="flex items-center gap-2 mt-auto mb-2 shrink-0">
        <button className="flex-1 px-3 py-2 rounded-md bg-[#0c1f4a] text-white text-[13px] font-semibold hover:bg-[#0a183d] transition-colors duration-200 shadow-sm text-center">
          Ochish
        </button>
        <button 
          onClick={onMoreClick}
          className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors duration-200 shadow-sm text-center">
          Ko'proq
        </button>
      </div>
    </div>
  </div>
)

export default function MeyoriyHujjatlarPage() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedDocuments = documents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const chunkedDocuments = [];
  for(let i = 0; i < paginatedDocuments.length; i += 5) {
    chunkedDocuments.push(paginatedDocuments.slice(i, i + 5));
  }

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
                  <Link to="#" className="hover:text-white transition-colors">
                    Institut
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">Me'yoriy hujjatlar</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow bg-slate-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 text-center py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0c1f4a] uppercase tracking-wide">
              Me'yoriy hujjatlar
            </h1>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-[15px]">
              Institut faoliyatini tartibga soluvchi asosiy qonun, qaror, farmon va nizomlar to'plami.
            </p>
          </div>

          <div className="flex flex-col gap-12 pb-16">
            {chunkedDocuments.map((chunk, rowIdx) => (
              <div className="relative" key={rowIdx}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-0 relative z-10 px-2 lg:px-4 items-stretch">
                  {chunk.map((doc, idx) => (
                    <div key={doc.id} className="pb-1">
                      <DocumentCard 
                        number={doc.id}
                        title={doc.title}
                        type={doc.type}
                        color={doc.color}
                        onMoreClick={() => setSelectedDoc(doc)}
                      />
                    </div>
                  ))}
                </div>
                {/* 3D Tokcha */}
                <div className="w-full h-6 bg-[#d97706] border-b-[8px] border-[#92400e] shadow-[0_15px_20px_-5px_rgba(0,0,0,0.4)] relative z-20 rounded-sm -mt-[1px]"></div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 mb-8">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#0c1f4a] transition-colors bg-white shadow-sm cursor-pointer">
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold shadow-sm cursor-pointer transition-colors ${
                    currentPage === page 
                      ? 'bg-[#0c1f4a] text-white shadow-md border-transparent' 
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0c1f4a] bg-white'
                  }`}>
                  {page}
                </button>
              ))}
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#0c1f4a] transition-colors bg-white shadow-sm cursor-pointer">
                <ChevronRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className={`h-3 w-full ${selectedDoc.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-[#0c1f4a]">Hujjat haqida ma'lumot</h2>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 shadow-inner">
                 <p className="text-slate-800 text-[15px] font-medium leading-relaxed">{selectedDoc.title}</p>
              </div>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-semibold border border-slate-200">
                   {selectedDoc.type}
                 </span>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
               <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition-colors text-[13px]">
                 Yopish
               </button>
               <button className="px-4 py-2 rounded-lg bg-[#0c1f4a] text-white font-semibold hover:bg-[#0a183d] transition-colors shadow-sm text-[13px]">
                 Ochish
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
