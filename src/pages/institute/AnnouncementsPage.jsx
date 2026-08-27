import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, Eye } from 'lucide-react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Commet } from 'react-loading-indicators';
import urspiImage from '../../assets/images/urspi_new.png';
import { announcementsAPI, getFileUrl } from '../../api';

export default function AnnouncementsPage() {
    const { i18n } = useTranslation();
    const [announcementsList, setAnnouncementsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchAnnouncements = async () => {
            setLoading(true);
            let apiData = [];
            const lang = i18n.language || 'uz';
            try {
                const landingRes = await announcementsAPI.getLanding(0, 50);
                apiData = landingRes?.data?.content || landingRes?.data || landingRes?.content || (Array.isArray(landingRes) ? landingRes : []);
            } catch (err) {
                console.warn('Failed to load landing announcements from API:', err.message);
                try {
                    const res = await announcementsAPI.getAll(lang);
                    apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
                } catch (e) {
                    console.warn('Failed to load announcements fallback from API:', e.message);
                }
            }

            let localItems = [];
            try {
                localItems = JSON.parse(localStorage.getItem('urspi_custom_announcements') || '[]');
            } catch (e) {}

            const combinedMap = new Map();
            localItems.forEach(item => combinedMap.set(item.id, item));
            apiData.forEach(item => {
                if (!combinedMap.has(item.id)) {
                    combinedMap.set(item.id, item);
                }
            });

            const rawData = Array.from(combinedMap.values());
            rawData.sort((a, b) => (b.id || 0) - (a.id || 0));

            if (isMounted) {
                const formatted = rawData.map((item, index) => {
                    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
                    const title = item[`title${langKey}`] || item.title || item.titleUz || item.titleRu || item.titleEn || "E'lon";
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
                        image: getFileUrl(item.imageLink || item.image) || urspiImage
                    };
                });
                setAnnouncementsList(formatted);
                setLoading(false);
            }
        };

        fetchAnnouncements();
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
                                    <span className="text-white font-medium">E'lonlar</span>
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
                        {announcementsList.map((item) => (
                            <Link 
                                to={`/announcements/${item.id}`}
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
