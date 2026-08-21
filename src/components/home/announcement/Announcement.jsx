import { ChevronRight } from 'lucide-react'
import { GrAnnounce } from 'react-icons/gr'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import urspiImage from '../../../assets/images/urspi_new.png'
import { announcementsAPI, getFileUrl } from '../../../api'

export default function Announcement() {
    const { t, i18n } = useTranslation()
    const [announcementsList, setAnnouncementsList] = useState([])
    const [loading, setLoading] = useState(true)
    const sectionRef = useRef(null)

    useEffect(() => {
        let isMounted = true;
        const fetchAnnouncements = async () => {
            setLoading(true);
            let apiData = [];
            const lang = i18n.language || 'uz';
            try {
                const landingRes = await announcementsAPI.getLanding(0, 10);
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
            // Sort by latest first
            rawData.sort((a, b) => (b.id || 0) - (a.id || 0));

            if (isMounted) {
                const formatted = rawData.map((item, index) => {
                    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
                    const title = item[`title${langKey}`] || item.title || item.titleUz || item.titleRu || item.titleEn || "E'lon";
                    let dateStr = "2026-08-21";
                    if (item.createdAt) {
                        dateStr = new Date(item.createdAt).toLocaleDateString('uz-UZ');
                    } else if (item.date) {
                        dateStr = item.date;
                    }
                    return {
                        id: item.id || index + 1,
                        date: dateStr,
                        title,
                        image: item.image ? item.image : (getFileUrl(item.imageLink || item.image) || urspiImage)
                    };
                });
                setAnnouncementsList(formatted.slice(0, 5));
                setLoading(false);
            }
        };

        fetchAnnouncements();
        return () => { isMounted = false; };
    }, [i18n.language]);

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
    }, [announcementsList])

    return (
        <section ref={sectionRef} className="w-full bg-slate-50 py-12 md:py-16 text-left" aria-labelledby="announcement-heading">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="relative flex flex-col items-center justify-center mb-8 gap-4 text-center reveal-on-scroll opacity-0">
                    <h2 id="announcement-heading" className="flex items-center justify-center gap-3 md:gap-4 font-bold tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                        -
                        <GrAnnounce style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
                        {t('home.announcements.title')}
                        -
                    </h2>
                    <Link to="/announcements" className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        {t('home.announcements.view_all')} <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {announcementsList.map((item, idx) => (
                        <Link 
                            to={`/announcements/${item.id}`}
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-pointer reveal-on-scroll opacity-0"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-[220px] w-full overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt="Announcement"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                                />
                                {/* Megaphone Icon overlay */}
                                <div className="absolute top-3 left-3 rounded-lg bg-[#ebe9e1] p-2 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105">
                                    <GrAnnounce className="h-8 w-8 text-[#0c1f4a]" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col bg-white p-5">
                                <div className="flex items-center font-medium mb-2.5">
                                    <FaRegCalendarAlt className="h-4 w-4 mr-2 text-amber-500" />
                                    <span className="text-[14px] text-[#0c1f4a]">{item.date}</span>
                                </div>
                                <h3 className="line-clamp-3 text-[14px] font-medium leading-[1.5] text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
