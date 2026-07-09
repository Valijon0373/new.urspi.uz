import React from 'react'
import { ChevronRight, ArrowRight, BookOpen, GraduationCap, Library, Users, Award, Briefcase, Heart, Star, Scale, Globe, Shield, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'

export const centers = [
  {
    id: 1,
    title: "TA'LIM SIFATINI NAZORAT QILISH BO'LIMI",
    description: "Ta'lim jarayonining sifatini nazorat qilish va monitoringini olib boradi.",
    icon: <BookOpen className="w-10 h-10 text-orange-500" />,
    borderColor: "border-t-orange-500",
    iconBg: "bg-orange-50"
  },
  {
    id: 2,
    title: "ILMIY TADQIQOTLAR, INNOVATSIYALAR VA ILMIY-PEDAGOGIK KADRLAR TAYYORLASH",
    description: "Ilmiy tadqiqotlar, innovatsiyalar va kadrlar tayyorlashni rivojlantiradi.",
    icon: <GraduationCap className="w-10 h-10 text-blue-500" />,
    borderColor: "border-t-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    id: 3,
    title: "O'QUV USLUBIY BOSHQARMASI",
    description: "O'quv-uslubiy faoliyatni tashkil etadi va muvofiqlashtiradi.",
    icon: <Library className="w-10 h-10 text-green-500" />,
    borderColor: "border-t-green-500",
    iconBg: "bg-green-50"
  },
  {
    id: 4,
    title: "JISMONIY VA YURIDIK SHAXSLARNING MUROJAATLARI BILAN ISHLASH",
    description: "Murojaatlarni qabul qilish, nazorat qilish va ularni ko'rib chiqadi.",
    icon: <Users className="w-10 h-10 text-amber-500" />,
    borderColor: "border-t-amber-500",
    iconBg: "bg-amber-50"
  },
  {
    id: 5,
    title: "MAGISTRATURA BO'LIMI",
    description: "Magistraturaga qabul, o'qitish va bitiruvchilar bilan ishlashni ta'minlaydi.",
    icon: <Award className="w-10 h-10 text-emerald-500" />,
    borderColor: "border-t-emerald-500",
    iconBg: "bg-emerald-50"
  },
  {
    id: 6,
    title: "XODIMLAR BO'LIMI",
    description: "Xodimlar bilan ishlash, ularning huquqlari va majburiyatlarini ta'minlaydi.",
    icon: <Briefcase className="w-10 h-10 text-purple-500" />,
    borderColor: "border-t-purple-500",
    iconBg: "bg-purple-50"
  },
  {
    id: 7,
    title: "YOSHLAR BILAN ISHLASH VA MA'NAVIY-MA'RIFAT BO'LIMI",
    description: "Yoshlar bilan ishlash va ularning ma'naviy-ma'rifiy rivojlanishini qo'llab-quvvatlaydi.",
    icon: <Heart className="w-10 h-10 text-red-500" />,
    borderColor: "border-t-red-500",
    iconBg: "bg-red-50"
  },
  {
    id: 8,
    title: "IQTIDORLI TALABALAR BILAN ISHLASH BO'LIMI",
    description: "Iqtiqdorli talabalarni aniqlash va ularning bilimini rivojlantirish bilan shug'ullanadi.",
    icon: <Star className="w-10 h-10 text-yellow-400" />,
    borderColor: "border-t-yellow-400",
    iconBg: "bg-yellow-50"
  },
  {
    id: 9,
    title: "YURIDIK XIZMAT",
    description: "Huquqiy masalalar bo'yicha tashkiliy va huquqiy yordam ko'rsatadi.",
    icon: <Scale className="w-10 h-10 text-indigo-500" />,
    borderColor: "border-t-indigo-500",
    iconBg: "bg-indigo-50"
  },
  {
    id: 10,
    title: "XALQARO HAMKORLIK BO'LIMI",
    description: "Xalqaro aloqalar va hamkorlikni rivojlantirish bilan shug'ullanadi.",
    icon: <Globe className="w-10 h-10 text-cyan-500" />,
    borderColor: "border-t-cyan-500",
    iconBg: "bg-cyan-50"
  },
  {
    id: 11,
    title: "KASABA UYUSHMASI QO'MITASI",
    description: "Xodimlar va talabalar huquqlarini himoya qilish va ijtimoiy qo'llab-quvvatlashni ta'minlaydi.",
    icon: <Shield className="w-10 h-10 text-rose-500" />,
    borderColor: "border-t-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    id: 12,
    title: "RAQAMLI TA'LIM TEXNOLOGIYALARI MARKAZI",
    description: "Axborot texnologiyalari sohasidagi faoliyatni tashkil etadi va qo'llab-quvvatlaydi.",
    icon: <Monitor className="w-10 h-10 text-blue-600" />,
    borderColor: "border-t-blue-600",
    iconBg: "bg-blue-50",
    headName: "MATSAPAYEV ODILBEK BAXTIYOR O'G'LI"
  }
];

export default function MarkazlarPage() {
  return (
    <div className="flex-grow bg-[#f8faff] flex flex-col min-h-[calc(100vh-200px)] pt-6 md:pt-10">
      
      <div className="flex flex-col flex-grow relative overflow-hidden">
        {/* Background building illustration (exact image provided by user) */}
        <div className="absolute top-0 right-0 lg:right-10 pointer-events-none hidden md:block z-0">
          <img 
            src="/building.png" 
            alt="Building Illustration" 
            className="w-[300px] lg:w-[450px] object-contain opacity-90 mix-blend-multiply"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
          
          <div className="mb-10 pt-4 md:pt-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0c1f4a] mb-4">
              Markazlar va bo'limlar
            </h1>
            <p className="text-slate-500 text-[15px] md:text-base">
              Institutimizning markazlari va bo'limlari bilan tanishing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {centers.map((center) => (
              <div 
                key={center.id} 
                className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${center.borderColor}`}
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-4 items-start mb-6">
                    <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${center.iconBg}`}>
                      {center.icon}
                    </div>
                    <h3 className="font-bold text-[#0c1f4a] text-[13px] md:text-[14px] uppercase tracking-wide leading-tight mt-1">
                      {center.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-6 flex-grow">
                    {center.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      to={`/markazlar/${center.id}`} 
                      className="inline-flex items-center gap-2 text-blue-600 font-bold text-[13px] hover:text-[#0c1f4a] transition-colors"
                    >
                      Batafsil <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
