import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'lucide-react';
import { PiLinkSimple } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';

const Links = () => {
  const { t } = useTranslation();
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevEl || !nextEl) return;

    swiper.params.navigation.prevEl = prevEl;
    swiper.params.navigation.nextEl = nextEl;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [prevEl, nextEl]);

  const officialLinks = [
    {
      id: 1,
      title: "Yagona interaktiv davlat xizmatlari portali",
      url: "https://my.gov.uz/ru",
      image: "https://my.gov.uz/img/logo_ru.svg"
    },
    {
      id: 2,
      title: "O'zbekiston Respublikasi Prezidenti",
      url: "https://president.uz/oz",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/100px-Emblem_of_Uzbekistan.svg.png"
    },
    {
      id: 3,
      title: "O'zbekiston Respublikasi ochiq ma'lumotlar portali",
      url: "https://data.egov.uz/",
      image: "https://data.egov.uz/favicon.ico"
    },
    {
      id: 4,
      title: "Normativ-huquqiy hujjatlar loyihalarini muhokama qilish",
      url: "https://regulation.gov.uz/",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Emblem_of_Uzbekistan.svg/100px-Emblem_of_Uzbekistan.svg.png"
    }
  ];

  return (
    <section className="bg-[#f4f7f9] py-10 w-full font-sans">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="relative flex items-center justify-center mb-10">
          <h2 className="flex items-center gap-3 md:gap-4 font-bold tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
            -
            <PiLinkSimple style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
            {t('home.links.title')}
            -
          </h2>
          <div className="absolute right-0 flex items-center gap-2">
            <button
              ref={(node) => setPrevEl(node)}
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="w-9 h-9 flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          modules={[Navigation, Autoplay]}
          loop={true}
          speed={600}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{ prevEl, nextEl }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-2"
        >
          {[...officialLinks, ...officialLinks].map((link, index) => (
            <SwiperSlide key={`${link.id}-${index}`} className="h-auto">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-gray-200 p-5 h-full flex flex-col hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                    {link.image ? (
                      <img
                        src={link.image}
                        alt={link.title}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl"
                      style={{ display: link.image ? 'none' : 'flex' }}
                    >
                      {link.title.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 leading-snug group-hover:text-blue-700 transition-colors">
                    {link.title}
                  </h3>
                </div>

                <div className="mt-auto pt-2">
                  <div className="bg-[#f6f6f6] text-blue-500 flex items-center gap-2 px-3 py-2.5 rounded-md w-full">
                    <Link size={16} className="shrink-0" />
                    <span className="text-xs font-medium truncate">
                      {link.url}
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Links;
