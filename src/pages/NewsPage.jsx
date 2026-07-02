import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, Eye } from 'lucide-react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import urspiImage from '../assets/images/urspi_new.png';

const mockNews = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 1,
    date: `1${(index % 9) + 1}.06.2026`,
    views: Math.floor(Math.random() * 500) + 150,
    title: index % 2 === 0 
        ? "Oliy ta'lim, fan va innovatsiyalar vaziri Qo'ng'irotboy Sharipov UrDPI yangi o'quv binosi bilan tanishdi"
        : "UrDPI va TDYU o'rtasida strategik hamkorlik memorandumi imzolandi",
    image: urspiImage
}));

export default function NewsPage() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <main className="flex-1 bg-slate-50">
            {/* Header Banner */}
            <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
                <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
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
                                    <span className="text-white font-medium">Yangiliklar</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockNews.map((item) => (
                        <Link 
                            to={`/news/${item.id}`}
                            key={item.id} 
                            className="group relative h-[280px] w-full overflow-hidden rounded-2xl cursor-pointer block"
                        >
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f4a]/90 via-[#0c1f4a]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                            
                            {/* Card Content */}
                            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                                <h3 className="text-white font-medium text-sm line-clamp-2 mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-white text-xs">
                                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{item.views}</span>
                                    </div>
                                    <div className="flex items-center px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-white text-xs">
                                        <FaRegCalendarAlt className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination (Mock) */}
                <div className="flex justify-center items-center mt-12 gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-blue-600 hover:bg-blue-50 transition-colors">
                        1
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-slate-600 hover:bg-gray-50 transition-colors">
                        2
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-slate-600 hover:bg-gray-50 transition-colors">
                        3
                    </button>
                    <span className="text-slate-500">...</span>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-slate-600 hover:bg-gray-50 transition-colors">
                        82
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-slate-600 hover:bg-gray-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </main>
    );
}
