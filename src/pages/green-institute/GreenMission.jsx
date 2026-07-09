import React from 'react';
import { Globe2, ShieldCheck, Users } from 'lucide-react';

const GreenMission = () => {
  return (
    <section className="py-24 bg-[#011a14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left image/graphic side */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-full blur-3xl"></div>
          <div className="relative aspect-square max-w-md mx-auto rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
             <Globe2 className="w-48 h-48 md:w-64 md:h-64 text-emerald-300 animate-[spin_40s_linear_infinite]" strokeWidth={1} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#011a14] to-transparent opacity-60"></div>
          </div>
        </div>

        {/* Right content side */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-3">Bizning Missiyamiz</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">Ekologik barqarorlik orqali ta'lim sifatini oshirish</h3>
          <p className="text-emerald-100/70 text-lg mb-10 leading-relaxed">
            Urganch Davlat Pedagogika Instituti yashil ta'lim konsepsiyasini joriy etish orqali, talabalarda ekologik madaniyatni shakllantirish, resurslardan unumli foydalanish va tabiat bilan uyg'unlikda yashashni targ'ib qiladi.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-5 items-start">
              <div className="p-3 md:p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Tabiatni Himoyalash</h4>
                <p className="text-emerald-100/60 leading-relaxed">Universitetdagi barcha jarayonlarda atrof-muhitga yetkaziladigan zararni minimallashtirish va xavfsiz muhit yaratish.</p>
              </div>
            </div>
            
            <div className="flex gap-5 items-start">
              <div className="p-3 md:p-4 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex-shrink-0">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Ijtimoiy Mas'uliyat</h4>
                <p className="text-emerald-100/60 leading-relaxed">Talabalar va xodimlar ishtirokida doimiy ekologik aksiyalar, xasharlar va daraxt ekish tadbirlarini tashkil etish.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GreenMission;
