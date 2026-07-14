import { useState } from 'react';
import { FileText, Download, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const documents = [
    {
        id: 1,
        title: "O'zbekiston Respublikasining \"Korrupsiyaga qarshi kurashish to'g'risida\"gi Qonuni",
        size: "1.2 MB",
        date: "2017-yil 3-yanvar",
        type: "PDF"
    },
    {
        id: 2,
        title: "Korrupsiyaga qarshi kurashish bo'yicha ichki nazorat qoidalari",
        size: "850 KB",
        date: "2024-yil 12-fevral",
        type: "PDF"
    },
    {
        id: 3,
        title: "Odob-axloq qoidalari va manfaatlar to'qnashuvini boshqarish nizomi",
        size: "2.1 MB",
        date: "2023-yil 5-sentabr",
        type: "PDF"
    },
    {
        id: 4,
        title: "Korrupsiyaviy xavf-xatarlarni baholash metodikasi",
        size: "1.5 MB",
        date: "2023-yil 18-oktabr",
        type: "PDF"
    }
];

const policyHighlights = [
    "Halollik va ochiqlik prinsiplariga qat'iy rioya qilish",
    "Korrupsion holatlarga nisbatan murosasizlik munosabati",
    "Davlat xaridlarida shaffoflikni ta'minlash",
    "Xodimlar va talabalarning huquqiy savodxonligini oshirish"
];

export default function DocumentsSection() {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(documents.length / itemsPerPage);
    const currentDocs = documents.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div id="hujjatlar" className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12 reveal-on-scroll opacity-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0c1f4a] mb-4">
                        Me'yoriy hujjatlar va qoidalar
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Institutimizda korrupsiyaga qarshi kurashish siyosatini belgilovchi asosiy hujjatlar va qonunchilik hujjatlari bilan tanishishingiz mumkin.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left side - Policy highlights */}
                    <div className="lg:col-span-5 space-y-8 reveal-on-scroll opacity-0">
                        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm h-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Asosiy prinsiplar</h3>
                            <ul className="space-y-4">
                                {policyHighlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-700 leading-relaxed">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-blue-800 font-medium italic">
                                    "Korrupsiyaga qarshi kurashish - har birimizning mas'uliyatimizdir!"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Documents list */}
                    <div className="lg:col-span-7 space-y-4 reveal-on-scroll opacity-0" style={{ animationDelay: '150ms' }}>
                        <div className="space-y-4 min-h-[300px]">
                            {currentDocs.map((doc, idx) => (
                                <div 
                                    key={doc.id}
                                    className="group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-[#0c1f4a] transition-colors">
                                                {doc.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span>{doc.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{doc.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-[#0c1f4a] hover:text-white text-gray-700 font-medium text-sm rounded-lg transition-colors shrink-0">
                                        <Download className="w-4 h-4" />
                                        Yuklab olish
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center sm:justify-end gap-3 mt-8 pt-4">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Orqaga
                                </button>
                                <span className="text-sm font-medium text-gray-600">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Oldinga
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
