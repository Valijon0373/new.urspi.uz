import { ChevronRight } from 'lucide-react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { PiNewspaperClipping } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import urspiImage from '../../../assets/images/urspi_new.png'
import { newsAPI, getFileUrl } from '../../../api'

export default function News() {
    const { t, i18n } = useTranslation()
    const [newsList, setNewsList] = useState([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useRef(null)

    useEffect(() => {
        let isMounted = true;
        const fetchNews = async () => {
            setLoading(true);
            let apiData = [];
            const lang = i18n.language || 'uz';
            try {
                const landingRes = await newsAPI.getLanding(0, 10);
                apiData = landingRes?.data?.content || landingRes?.data || landingRes?.content || (Array.isArray(landingRes) ? landingRes : []);
            } catch (err) {
                console.warn('Failed to load landing news from API:', err.message);
                try {
                    const res = await newsAPI.getAll(lang);
                    apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
                } catch (e) {
                    console.warn('Failed to load news fallback from API:', e.message);
                }
            }

            let localItems = [];
            try {
                localItems = JSON.parse(localStorage.getItem('urspi_custom_news') || '[]');
            } catch (e) {}

            const combinedMap = new Map();
            localItems.forEach(item => combinedMap.set(item.id, item));
            apiData.forEach(item => {
                if (!combinedMap.has(item.id)) {
                    combinedMap.set(item.id, item);
                }
            });

            const rawData = Array.from(combinedMap.values());
            // Sort by latest first
            rawData.sort((a, b) => (b.id || 0) - (a.id || 0));

            if (isMounted) {
                const formatted = rawData.map((item, index) => {
                    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
                    const title = item[`title${langKey}`] || item.title || item.titleUz || item.titleRu || item.titleEn || "Yangilik";
                    let dateStr = "2026-08-21";
                    if (item.createdAt) {
                        dateStr = new Date(item.createdAt).toLocaleDateString('uz-UZ');
                    } else if (item.date) {
                        dateStr = item.date;
                    }
                    return {
                        id: item.id || index + 1,
                        title,
                        image: getFileUrl(item.mainImageLink || item.mainImage || item.image) || urspiImage,
                        date: dateStr,
                        isFeatured: index === 0
                    };
                });
                setNewsList(formatted.slice(0, 5));
                setLoading(false);
            }
        };

        fetchNews();
        return () => { isMounted = false; };
    }, [i18n.language]);

    const displayNews = newsList.slice(0, 5)
    const featuredItem = displayNews[0]
    const regularItems = displayNews.slice(1, 5)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up')
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })

        const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll')
        if (elements) {
            elements.forEach(el => observer.observe(el))
        }

        return () => observer.disconnect()
    }, [newsList])

    return (
        <section ref={sectionRef} className="w-full bg-white py-12 md:py-16 text-left" aria-labelledby="news-heading">
            <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

                {/* Header section */}
                <div className="relative flex flex-col items-center justify-center mb-8 gap-4 text-center reveal-on-scroll opacity-0">
                    <h2 id="news-heading" className="flex items-center justify-center gap-3 md:gap-4 font-bold tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                        -
                        <PiNewspaperClipping style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
                        {t('home.news.title')}
                        -
                    </h2>
                    <Link to="/news" className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        {t('home.news.view_all')} <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Large Featured Card */}
                    {featuredItem && (
                        <Link to={`/news/${featuredItem.id}`} className="block group relative aspect-[4/3] min-h-[180px] lg:min-h-[500px] overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl lg:h-full reveal-on-scroll opacity-0">
                            {/* Image */}
                            <img
                                src={featuredItem.image}
                                alt={featuredItem.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Bottom Overlay Info */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-stretch min-h-[110px] lg:min-h-[160px]">
                                {/* Vertical Blue Bar */}
                                <div className="bg-[#1d4ed8] text-white font-bold uppercase tracking-wider text-[9px] lg:text-xs flex items-center justify-center w-8 lg:w-12 shrink-0 select-none [writing-mode:vertical-lr] rotate-180 border-r border-white/10">
                                    {t('home.news.label')}
                                </div>

                                {/* Content Panel */}
                                <div className="flex-1 bg-black/20 backdrop-blur-sm p-3 lg:p-6 flex flex-col justify-between text-white">
                                    <h3 className="text-xs md:text-sm lg:text-lg font-bold leading-snug group-hover:text-blue-300 transition-colors line-clamp-2 lg:line-clamp-3">
                                        {featuredItem.title}
                                    </h3>

                                    {/* Meta details */}
                                    <div className="flex items-center gap-2 mt-2 lg:mt-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-md bg-black/40 border border-white/20 text-[11px] lg:text-xs font-medium text-white">
                                            <FaRegCalendarAlt className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
                                            {featuredItem.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Right Column: 2x2 Grid of Smaller Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {regularItems.map((item, idx) => (
                            <Link
                                to={`/news/${item.id}`}
                                key={item.id}
                                className="block group relative aspect-[4/3] min-h-[180px] overflow-hidden rounded-2xl shadow-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg reveal-on-scroll opacity-0"
                                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
                            >
                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Bottom Overlay Info */}
                                <div className="absolute bottom-0 left-0 right-0 flex items-stretch min-h-[110px]">
                                    {/* Vertical Blue Bar */}
                                    <div className="bg-[#1d4ed8] text-white font-bold uppercase tracking-wider text-[9px] flex items-center justify-center w-8 shrink-0 select-none [writing-mode:vertical-lr] rotate-180 border-r border-white/10">
                                        {t('home.news.label')}
                                    </div>

                                    {/* Content Panel */}
                                    <div className="flex-1 bg-black/20 backdrop-blur-sm p-3 flex flex-col justify-between text-white">
                                        <h3 className="text-xs sm:text-xs md:text-sm font-bold leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>

                                        {/* Meta details */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/20 text-[11px] font-medium text-white">
                                                <FaRegCalendarAlt className="h-3.5 w-3.5 shrink-0" />
                                                {item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
