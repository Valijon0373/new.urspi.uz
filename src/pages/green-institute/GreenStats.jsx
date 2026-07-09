import React, { useEffect, useState } from 'react';
import { TreePine, Recycle, Sun, LeafyGreen } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl transition-transform hover:-translate-y-2">
      <div className="p-4 bg-emerald-500/20 rounded-2xl mb-4">
        <Icon className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200 mb-2">
        {count}{suffix}
      </h3>
      <p className="text-sm md:text-base font-medium text-emerald-100/70 uppercase tracking-widest text-center">
        {title}
      </p>
    </div>
  );
};

const GreenStats = () => {
  return (
    <section className="py-20 bg-[#011a14] relative overflow-hidden z-20 -mt-10 rounded-t-[3rem] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={TreePine} title="Ekilgan Daraxtlar" value={500} />
          <StatCard icon={Recycle} title="Qayta ishlangan (T)" value={110} />
          <StatCard icon={Sun} title="Quyosh energiyasi (kVt)" value={450} />
          <StatCard icon={LeafyGreen} title="Yashil Loyihalar" value={5} />
        </div>
      </div>
    </section>
  );
};

export default GreenStats;
