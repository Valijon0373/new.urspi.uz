import React, { useRef, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const TeamCard = ({ name, role, desc, initials, gradient }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-center justify-between mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br ${gradient} shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-4 ring-white/5`}>
              {initials}
            </div>
            <div className="flex space-x-3" style={{ transform: 'translateZ(20px)' }}>
              <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600/50 text-slate-300 hover:text-white">
                <FaGithub size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer border border-slate-600/50 text-slate-300 hover:text-white">
                <FaLinkedin size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
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

          <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center text-sm font-medium text-slate-200 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2.5 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
              Har doim aloqada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutUs() {
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
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Biz <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Haqimizda</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Platformamiz ortida turgan tajribali va yaratuvchan jamoa bilan tanishing. Bizning maqsadimiz foydalanuvchilarga eng yaxshi tajribani taqdim etish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}
