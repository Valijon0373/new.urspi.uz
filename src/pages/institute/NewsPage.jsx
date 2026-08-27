import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, Eye } from 'lucide-react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Commet } from 'react-loading-indicators';
import urspiImage from '../../assets/images/urspi_new.png';
import { newsAPI, getFileUrl } from '../../api';

export default function NewsPage() {
    const { i18n } = useTranslation();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchNews = async () => {
            setLoading(true);
            let apiData = [];
            const lang = i18n.language || 'uz';
            try {
                const landingRes = await newsAPI.getLanding(0, 50);
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

            if (isMounted) {
                const formatted = rawData.map((item, index) => {
                    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
                    const title = item[`title${langKey}`] || item.title || item.titleUz || item.titleRu || item.titleEn || "Yangilik";
                    const content = item[`content${langKey}`] || item.content || item.contentUz || item.contentRu || item.contentEn || "";
                    let dateStr = "2026-08-21";
                    if (item.createdAt) {
                        dateStr = new Date(item.createdAt).toLocaleDateString('uz-UZ');
                    } else if (item.date) {
                        dateStr = item.date;
                    }
                    return {
                        id: item.id || index + 1,
                        title,
                        content,
                        date: dateStr,
                        views: item.views || item.viewCount || 0,
                        image: getFileUrl(item.mainImageLink || item.mainImage || item.image) || urspiImage
                    };
                });
                setNewsList(formatted);
                setLoading(false);
            }
        };

        fetchNews();
        return () => { isMounted = false; };
    }, [i18n.language]);

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
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Commet color="#3151cc" size="large" text="Kuting..." textColor="" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newsList.map((item) => (
                            <Link 
                                to={`/news/${item.id}`}
                                key={item.id} 
                                className="group relative h-[280px] w-full overflow-hidden rounded-2xl cursor-pointer block"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    onError={(e) => { e.target.onerror = null; e.target.src = urspiImage; }}
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
                                            <FaRegCalendarAlt className="w-3.5 h-3.5 mr-1.5" />
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
