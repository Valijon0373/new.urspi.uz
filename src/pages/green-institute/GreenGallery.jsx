import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { greenInstitutesAPI, getFileUrl } from '../../api';
import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import urspiImage from '../../assets/images/urspi_new.png';

const DEFAULT_GREEN_IMAGES = [
  slider1,
  slider2,
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80',
  urspiImage,
];

const getImageUrl = (item) => {
  if (!item) return '';
  
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (trimmed.startsWith('blob:')) return ''; // Discard dead blob URLs
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    return getFileUrl(trimmed);
  }

  const keys = ['image', 'photo', 'imageLink', 'photoLink', 'filePath', 'fileName', 'fileLink', 'file', 'url', 'path', 'link'];
  let raw = '';

  for (const k of keys) {
    const val = item[k];
    if (typeof val === 'string' && val.trim() && !val.trim().startsWith('blob:')) {
      raw = val.trim();
      break;
    }
    if (val && typeof val === 'object') {
      const nested = val.link || val.url || val.path || val.filePath || val.fileName || val.fileLink || val.photoLink || val.imageLink;
      if (typeof nested === 'string' && nested.trim() && !nested.trim().startsWith('blob:')) {
        raw = nested.trim();
        break;
      }
    }
  }

  if (!raw) {
    for (const k of keys) {
      const val = item[k];
      if (typeof val === 'string' && val.trim()) {
        raw = val.trim();
        break;
      }
    }
  }
  
  if (raw) {
    if (raw.startsWith('blob:')) return '';
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw;
    }
    return getFileUrl(raw);
  }
  
  return '';
};

const GreenGallery = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    let apiItems = [];
    try {
      const res = await greenInstitutesAPI.getAll();
      apiItems = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (e) {
      console.warn('Failed to fetch green institutes for gallery:', e.message);
    }

    const itemsList = apiItems.filter(item => {
      if (!item) return false;
      if (item.active === false) return false;
      if (item.status && item.status !== 'ACTIVE') return false;
      return true;
    });

    let fetchedUrls = itemsList
      .map(item => getImageUrl(item))
      .filter(url => typeof url === 'string' && url.length > 0);

    if (fetchedUrls.length === 0) {
      fetchedUrls = DEFAULT_GREEN_IMAGES;
    }

    setImages(fetchedUrls);
    if (fetchedUrls.length > 0) {
      setActiveIdx(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
    const handleStorageChange = () => fetchGallery();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchGallery]);

  const total = images.length;

  const handlePrev = () => {
    if (total <= 1) return;
    setActiveIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    if (total <= 1) return;
    setActiveIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-[#022c22] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-3">Foto Galereya</h2>
        <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Yashil Universitet Hayotidan</h3>
        <p className="text-emerald-100/70 text-base md:text-lg">Tabiat uyg'unligi aks etgan maxsus lahzalar.</p>
      </div>

      {loading ? (
        <div className="relative w-full h-[300px] flex items-center justify-center text-emerald-200/70 font-medium z-20">
          Galereya rasmlari yuklanmoqda...
        </div>
      ) : images.length === 0 ? (
        <div className="relative w-full py-16 flex flex-col items-center justify-center text-center z-20">
          <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <ImageIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-emerald-100/80 font-medium text-lg">Hozircha foto galereya rasmlari mavjud emas</p>
          <p className="text-emerald-200/50 text-sm mt-1">Admin panel orqali yangi rasmlar yuklanganda bu yerda ko'rinadi.</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center max-w-7xl mx-auto px-4 z-20">
            {images.map((img, i) => {
              let offset = i - activeIdx;
              
              if (total > 1) {
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor((total - 1) / 2)) offset -= total;
              }
              
              let zIndex = 30 - Math.abs(offset) * 10;
              let scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.55;
              
              let translateX = offset * 60;
              if (Math.abs(offset) >= 2) {
                 translateX = offset > 0 ? 105 : -105;
              }

              let opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.8 : (Math.abs(offset) === 2 ? 0.5 : 0);

              return (
                <div 
                  key={i}
                  onClick={() => {
                    if (offset === 0) {
                      setModalImg(img);
                      setIsModalOpen(true);
                    } else {
                      setActiveIdx(i);
                    }
                  }}
                  className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer"
                  style={{
                    zIndex,
                    transform: `translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    pointerEvents: opacity === 0 ? 'none' : 'auto'
                  }}
                >
                  {/* Outer wrapper for the green border */}
                  <div 
                    className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center transition-colors duration-500 shadow-2xl"
                    style={{ 
                      backgroundColor: offset === 0 ? '#34d399' : '#059669',
                      clipPath: 'polygon(29% 0, 71% 0, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0 71%, 0 29%)',
                      padding: offset === 0 ? '6px' : '4px'
                    }}
                  >
                    {/* Inner image */}
                    <div 
                       className="w-full h-full bg-cover bg-center transition-all duration-700"
                       style={{ 
                         backgroundImage: `url(${img})`,
                         clipPath: 'polygon(29% 0, 71% 0, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0 71%, 0 29%)',
                         filter: offset !== 0 ? 'brightness(0.6) grayscale(30%)' : 'brightness(1) grayscale(0%)'
                       }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          {total > 1 && (
            <div className="relative z-30 mt-10 flex items-center justify-center gap-6">
              <button 
                onClick={handlePrev}
                className="p-3 md:p-4 rounded-full bg-emerald-900/50 hover:bg-emerald-500/50 border border-emerald-500/30 text-emerald-400 hover:text-white transition-all backdrop-blur-md"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button 
                onClick={handleNext}
                className="p-3 md:p-4 rounded-full bg-emerald-900/50 hover:bg-emerald-500/50 border border-emerald-500/30 text-emerald-400 hover:text-white transition-all backdrop-blur-md"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 p-2 text-white hover:text-emerald-400 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <img 
            src={modalImg} 
            alt="Yashil Universitet Gallery" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(52,211,153,0.3)] transform scale-100 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
};

export default GreenGallery;
