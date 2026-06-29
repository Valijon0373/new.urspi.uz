import React from 'react';
import { BsImages } from 'react-icons/bs';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const images = [
    "https://picsum.photos/id/10/800/450",
    "https://picsum.photos/id/20/800/450",
    "https://picsum.photos/id/30/800/450",
    "https://picsum.photos/id/40/800/450",
    "https://picsum.photos/id/50/800/450",
    "https://picsum.photos/id/60/800/450",
    "https://picsum.photos/id/70/800/450",
    "https://picsum.photos/id/80/800/450",
    "https://picsum.photos/id/90/800/450",
];

export default function Galery() {
    return (
        <section className="w-full bg-slate-50 py-12 md:py-16 text-left">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3 md:gap-4 text-[#1d4ed8]">
                        <BsImages style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
                        <h2 className="font-black tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                            Foto galereya
                        </h2>
                    </div>
                </div>

                {/* Carousel */}
                <div className="w-full relative max-w-[1500px] mx-auto">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        loop={true}
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
                        {images.map((img, index) => (
                            <SwiperSlide
                                key={index}
                                className="!w-[280px] sm:!w-[450px] md:!w-[600px] lg:!w-[750px]"
                            >
                                <div className="w-full aspect-[16/9]">
                                    <img
                                        src={img}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover shadow-2xl"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
