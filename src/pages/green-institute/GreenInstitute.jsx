import React, { useMemo } from 'react';
import { Leaf, Sprout, ArrowRight, TreePine } from 'lucide-react';
import './GreenInstitute.css';
import GreenStats from './GreenStats';
import GreenGallery from './GreenGallery';
import GreenMission from './GreenMission';

const GreenHero = () => {
  // Generate random leaves exactly once so they don't jump around on re-renders
  const leaves = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * 15}s`,
      size: 30 + Math.random() * 40, // 30px to 70px
      type: Math.random() > 0.5 ? 'leaf' : 'pine',
    }));
  }, []);

  return (
    <div className="relative w-full min-h-[70vh] bg-[#022c22] overflow-hidden flex items-center justify-center py-20">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-emerald-700/80 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-teal-600/70 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-lime-800/60 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Leaves Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="falling-leaf text-emerald-400/30"
            style={{
              left: leaf.left,
              animationDuration: leaf.animationDuration,
              animationDelay: leaf.animationDelay,
              width: leaf.size,
              height: leaf.size,
            }}
          >
            {leaf.type === 'leaf' ? (
              <Leaf className="w-full h-full transform rotate-45" />
            ) : (
              <TreePine className="w-full h-full" />
            )}
          </div>
        ))}
      </div>

      {/* Main Glassmorphism Content Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-[92%] max-w-6xl p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] glass-panel text-center transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">

        {/* Top Tag */}
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 mb-8 md:mb-10 backdrop-blur-md shadow-lg">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase">
            Ekologik Ta'lim
          </span>
        </div>

        {/* Subtitle */}
        <h2 className="text-sm md:text-xl lg:text-2xl font-medium text-emerald-100/70 tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6">
          Urganch Davlat Pedagogika Instituti
        </h2>

        {/* Main Title with Animated Gradient */}
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-200 to-teal-300 text-gradient-animate drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] mb-6 md:mb-8">
          YASHIL INSTITUT
        </h1>

        {/* Description */}
        <p className="max-w-3xl text-sm md:text-lg lg:text-xl font-light text-emerald-100/80 leading-relaxed mb-10 md:mb-14">
          Tabiatni asrash, ekologik ongni yuksaltirish va kelajak avlod uchun yashil dunyo yaratish yo'lidagi zamonaviy, interaktiv va yagona elektron platforma.
        </p>

        {/* Interactive Button */}
        <button className="group relative px-8 md:px-10 py-4 md:py-5 font-bold text-emerald-950 text-sm md:text-base bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full overflow-hidden shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <span className="relative flex items-center gap-3">
            Batafsil tanishish
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
        </button>

      </div>
    </div>
  );
};

const GreenInstitute = () => {
  return (
    <div className="w-full flex flex-col bg-[#011a14]">
      <GreenHero />
      <GreenStats />
      <GreenGallery />
      <GreenMission />
    </div>
  );
};

export default GreenInstitute;
