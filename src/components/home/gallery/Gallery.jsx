import React, { useState, useEffect } from 'react';
import { BsImages } from 'react-icons/bs';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { photoGalleriesAPI, getFileUrl } from '../../../api';

export default function Gallery() {
    const { t, i18n } = useTranslation();
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchGallery = async () => {
            setLoading(true);
            const lang = i18n.language || 'uz';
            let apiData = [];

            // 1. Try landing endpoint
            try {
                const landingRes = await photoGalleriesAPI.getLanding(0, 20, lang);
                apiData = Array.isArray(landingRes) ? landingRes : (landingRes?.content || landingRes?.data?.content || landingRes?.data || []);
            } catch (err) {
                console.warn('Landing photo galleries API failed:', err.message);
                // 2. Try main getAll endpoint
                try {
                    const res = await photoGalleriesAPI.getAll(lang);
                    apiData = Array.isArray(res) ? res : (res?.content || res?.data?.content || res?.data || []);
                } catch (e) {
                    console.warn('getAll photo galleries API failed:', e.message);
                    // 3. Try language endpoint
                    try {
                        const langRes = await photoGalleriesAPI.getByLang(lang);
                        apiData = Array.isArray(langRes) ? langRes : (langRes?.content || langRes?.data?.content || langRes?.data || []);
                    } catch (ex) {
                        console.warn('getByLang photo galleries API failed:', ex.message);
                    }
                }
            }

            const combinedData = apiData;

            if (isMounted) {
                if (combinedData && combinedData.length > 0) {
                    const langKey = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
                    const formatted = combinedData
                        .map((item, index) => {
                            const rawImage = item.photoLink || item.imageLink || item.fileLink || item.attachmentLink || item.mainImageLink || item.photoUrl || item.imageUrl || item.image || item.photo || item.file || item.url || item.link || item.filePath || item.imagePath || item.attachmentUrl || item.mainImage;
                            const title = item[`title${langKey}`] || item.title || item.titleUz || item.titleRu || item.titleEn || item.name || `Rasm ${index + 1}`;
                            
                            let imageUrl = '';
                            if (typeof rawImage === 'string' && rawImage.trim() !== '') {
                                imageUrl = getFileUrl(rawImage);
                            } else if (rawImage && typeof rawImage === 'object') {
                                const nested = rawImage.link || rawImage.url || rawImage.path || rawImage.filePath || rawImage.fileName;
                                if (nested) imageUrl = getFileUrl(nested);
                            }
                            if (!imageUrl && item.image && typeof item.image === 'string') {
                                imageUrl = getFileUrl(item.image);
                            }

                            return {
                                id: item.id || index + 1,
                                image: imageUrl,
                                title
                            };
                        })
                        .filter(item => Boolean(item.image));
                    setGalleryItems(formatted);
                } else {
                    setGalleryItems([]);
                }
                setLoading(false);
            }
        };

        fetchGallery();
        return () => { isMounted = false; };
    }, [i18n.language]);

    return (
        <section className="w-full bg-slate-50 py-12 md:py-16 text-left">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] overflow-hidden">

                {/* Header */}
                <div className="relative flex flex-col items-center justify-center mb-8 md:mb-10 gap-4 text-center">
                    <h2 className="flex items-center justify-center gap-3 md:gap-4 font-bold tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                        - 
                        <BsImages style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
                        {t('home.galery.title')}
                        -
                    </h2>
                    <a href="#" className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        {t('home.galery.view_all')} <ChevronRight className="h-4 w-4 ml-0.5" />
                    </a>
                </div>

                {/* Carousel or Empty State */}
                <div className="w-full relative max-w-[1500px] mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                        </div>
                    ) : galleryItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[250px] bg-white rounded-2xl p-8 text-slate-400 shadow-sm border border-slate-100">
                            <BsImages className="w-12 h-12 mb-3 text-slate-300" />
                            <p className="text-sm font-medium text-slate-500">Fotogalereyada rasmlar mavjud emas</p>
                        </div>
                    ) : (
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            loop={galleryItems.length > 2}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            coverflowEffect={{
                                rotate: 15,
                                stretch: 0,
                                depth: 300,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[EffectCoverflow, Pagination, Autoplay]}
                            className="w-full !pb-14"
                        >
                            {galleryItems.map((item, index) => (
                                <SwiperSlide
                                    key={item.id || index}
                                    className="!w-[280px] sm:!w-[450px] md:!w-[600px] lg:!w-[750px]"
                                >
                                    <div className="w-full aspect-[16/9] relative group overflow-hidden rounded-xl bg-slate-100">
                                        <img
                                            src={item.image}
                                            alt={item.title || `Gallery ${index + 1}`}
                                            className="w-full h-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {item.title && (
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-sm font-medium text-center line-clamp-1">{item.title}</p>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>

            {/* Custom Styles for Pagination */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .swiper-pagination-bullet {
            background-color: #cbd5e1;
            opacity: 1;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
            background-color: #1a237e;
            width: 20px;
            border-radius: 5px;
        }
      `}} />
        </section>
    );
}
