import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import urspiImage from '../../assets/images/urspi_new.png';

export default function NewsDetailPage() {
    const { id } = useParams();
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // Mock data for the specific news
    const news = {
        id,
        title: "Oliy ta'lim, fan va innovatsiyalar vaziri Qo'ng'irotboy Sharipov UrDPI yangi o'quv binosi bilan tanishdi",
        date: "20.06.2026",
        images: [slider1, slider2, urspiImage],
        content: `Oliy ta'lim, fan va innovatsiyalar vaziri Qo'ng'irotboy Sharipov boshchiligidagi ishchi guruh Urganch davlat pedagogika institutining yangi binosida olib borilayotgan qurilish va ta'mirlash ishlari bilan yaqindan tanishdi.

Tashrif doirasida vazir talabalar uchun yaratilayotgan zamonaviy sharoitlar, o'quv xonalarining jihozlanishi va laboratoriya uskunalari bilan ta'minlanishi holatini ko'zdan kechirdi. Shuningdek, pudratchi tashkilot vakillari bilan suhbatlashib, qurilish ishlarini belgilangan muddatda va sifatli yakunlash bo'yicha tegishli topshiriqlar berdi.

Institut rektor Diyorjon Abdullayev vazirga yangi bino imkoniyatlari hamda kelgusida amalga oshirilishi rejalashtirilgan istiqbolli loyihalar yuzasidan batafsil ma'lumot berdi.

Yangi o'quv binosi 2026-2027 o'quv yili boshidan foydalanishga topshirilishi kutilmoqda.`,
        views: 356
    };

    // Auto-slide effect
    useEffect(() => {
        if (!news.images || news.images.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % news.images.length);
        }, 3000);
        
        return () => clearInterval(timer);
    }, [news.images]);

    return (
        <main className="flex-1 bg-slate-50 pb-16">
            {/* Header Banner */}
            <div className="w-full bg-[#0c1f4a] py-8 md:py-12 flex flex-col justify-center">
                <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
                    <h1 className="text-3xl font-bold text-white mb-4">Yangiliklar</h1>
                    <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <li className="inline-flex items-center shrink-0">
                                <Link to="/" className="hover:text-white transition-colors">
                                    Bosh sahifa
                                </Link>
                            </li>
                            <li className="shrink-0">
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 mx-1" />
                                    <Link to="/news" className="hover:text-white transition-colors">
                                        Yangiliklar
                                    </Link>
                                </div>
                            </li>
                            <li className="truncate">
                                <div className="flex items-center truncate">
                                    <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
                                    <span className="text-white font-medium truncate">{news.title}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Content Card */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 md:p-10 overflow-hidden">
                    
                    {/* Image Carousel */}
                    {news.images && news.images.length > 0 && (
                        <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden mb-8 group">
                            <div 
                                className="flex h-full transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}
                            >
                                {news.images.map((img, idx) => (
                                    <img 
                                        key={idx}
                                        src={img} 
                                        alt={`Slide ${idx + 1}`}
                                        className="w-full h-full object-cover flex-shrink-0"
                                    />
                                ))}
                            </div>
                            
                            {/* Dots Navigation */}
                            {news.images.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                    {news.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                idx === currentImageIdx 
                                                    ? 'bg-blue-600 w-8' 
                                                    : 'bg-white/70 hover:bg-white w-4'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Date Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 text-blue-600 font-medium mb-6">
                        <FaRegCalendarAlt className="mr-2" />
                        {news.date}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-semibold text-[#0c1f4a] leading-snug mb-6">
                        {news.title}
                    </h2>

                    {/* Divider */}
                    <hr className="border-gray-200 mb-6" />

                    {/* Body Text */}
                    <div className="text-gray-700 leading-relaxed space-y-4 text-[15px] whitespace-pre-wrap">
                        {news.content}
                    </div>
                </div>
            </div>
        </main>
    );
}
