import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80', // Trees
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80', // Firs
  'https://images.unsplash.com/photo-1490750967868-88cb4aca8f60?auto=format&fit=crop&q=80', // Flowers
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80', // Forest
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80'  // Green leaves
];

const GreenGallery = () => {
  const [activeIdx, setActiveIdx] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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

      <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center max-w-7xl mx-auto px-4 z-20">
        {images.map((img, i) => {
          let offset = i - activeIdx;
          
          // Infinite loop math for 5 items
          if (offset < -2) offset += 5;
          if (offset > 2) offset -= 5;
          
          let zIndex = 30 - Math.abs(offset) * 10;
          let scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.55;
          
          // X translation
          let translateX = offset * 60; // Base translation
          if (Math.abs(offset) === 2) {
             translateX = offset > 0 ? 105 : -105;
          }

          let opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.8 : 0.5;

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
                opacity
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
          )
        })}
      </div>

      {/* Navigation Buttons */}
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
