import React, { useRef, useState } from 'react';
import { FaGithub, FaTelegram, FaInstagram, FaCamera } from 'react-icons/fa';

const TeamCard = ({ name, role, desc, initials, gradient }) => {
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation: max 15 degrees
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  return (
    <div className="relative group w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full rounded-3xl p-8 bg-gradient-to-b from-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))`,
            opacity: 0.15,
            transform: 'translateZ(-1px)'
          }}
        />

        <div className="relative z-10 flex flex-col items-center" style={{ transform: 'translateZ(40px)' }}>
          {/* Centered Image Upload */}
          <div 
            className="relative mb-6 cursor-pointer group/avatar" 
            onClick={() => fileInputRef.current?.click()}
            title="Rasm yuklash"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br ${gradient} shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-4 ring-white/10 overflow-hidden relative transition-transform duration-300 group-hover/avatar:scale-105`}>
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                <FaCamera size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center w-full">
            <div style={{ transform: 'translateZ(30px)' }}>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-md">{name}</h3>
              <p className={`text-xs font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                {role}
              </p>
            </div>
            
            <p className="text-slate-300 text-[15px] leading-relaxed min-h-[90px]" style={{ transform: 'translateZ(20px)' }}>
              {desc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between w-full gap-4" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center text-sm font-medium text-slate-200 bg-slate-800/80 px-4 py-2.5 rounded-full border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2.5 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
              Har doim aloqada
            </div>
            <div className="flex space-x-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-blue-500 transition-colors border border-slate-600/50 text-slate-300 hover:text-white" title="Telegram">
                <FaTelegram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-pink-500 transition-colors border border-slate-600/50 text-slate-300 hover:text-white" title="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-600 transition-colors border border-slate-600/50 text-slate-300 hover:text-white" title="Github">
                <FaGithub size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutUsAdmin() {
  const team = [
    {
      name: "Davlatmuratov Valijon",
      role: "FRONTEND VA UI/UX DASTURCHI",
      desc: "Talabalar uchun qulay va zamonaviy interfeys yaratib, barcha sahifalarda yagona dizayn uslubini joriy qiladi.",
      initials: "DV",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      name: "Otaboyev Akbar",
      role: "JAVA BACKEND DASTURCHISI",
      desc: "Ushbu platformaning server qismi, ma'lumotlar bilan ishlash va API larni xavfsiz boshqarish vazifalarini bajaradi.",
      initials: "OA",
      gradient: "from-orange-500 to-amber-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Biz haqimizda</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 overflow-hidden relative">
        {/* Background decorations for admin view */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10">
          {team.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
