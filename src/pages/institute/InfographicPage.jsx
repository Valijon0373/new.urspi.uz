import React, { useState } from 'react';
import { 
  ChevronRight, 
  Building2, 
  Building, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  UsersRound, 
  BookCopy, 
  UserPlus, 
  Calculator, 
  Presentation, 
  BookType, 
  Pencil, 
  Landmark, 
  BookMarked 
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import logoImg from '../../assets/images/logo1.jpg';

// ==== izoh: HistoryTimeline ma'lumotlari ====
const timelineData = [
  {
    year: '2022',
    text: "Prezidentning 289-sonli qaroriga asosan institut tashkil etildi."
  },
  {
    year: '2023',
    text: "5 ta fakultet va 15 ta kafedra faoliyat boshladi."
  },
  {
    year: '2024',
    text: "Yangi ta'lim yo'nalishlari va magistratura mutaxassisliklari ochildi."
  },
  {
    year: '2025',
    text: "Jami 8317 nafar talabaga ega zamonaviy oliy ta'lim muassasasiga aylandi."
  }
];

// ==== izoh: StatsGrid ma'lumotlari ====
const topStats = [
  { value: '5', label: 'Fakultet', icon: Building, color: 'text-blue-500' },
  { value: '15', label: 'Kafedra', icon: Layers, color: 'text-emerald-500' },
  { value: '8317', label: 'Talaba', icon: Users, color: 'text-purple-600' },
  { value: '19', label: "Bakalavriat\nyo'nalishlari", icon: BookOpen, color: 'text-orange-500' },
  { value: '11', label: 'Magistratura\nmutaxassisliklari', icon: GraduationCap, color: 'text-teal-500' }
];

const studentStats = [
  { value: '5 164', label: "Kunduzgi ta'lim", icon: UsersRound, color: 'text-blue-600', bg: 'bg-blue-50/50' },
  { value: '2 193', label: "Sirtqi ta'lim", icon: BookCopy, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
  { value: '202', label: 'Ikkinchi oliy\nmutaxassislik', icon: UserPlus, color: 'text-orange-500', bg: 'bg-orange-50/50' },
  { value: '357', label: 'Magistratura', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50/50' }
];

// ==== izoh: FacultiesGrid ma'lumotlari ====
const faculties = [
  {
    title: 'I. Aniq amaliy fanlar fakulteti',
    icon: Calculator,
    color: 'text-blue-600',
    dotColor: 'bg-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/30',
    departments: [
      "Matematika va kompyuter texnologiyalari kafedrasi",
      "Tabiiy fanlar kafedrasi",
      "Fizika va astronomiya kafedrasi",
      "Texnologik ta'lim kafedrasi"
    ],
    count: '4 ta kafedra'
  },
  {
    title: 'II. Pedagogika fakulteti',
    icon: Presentation,
    color: 'text-emerald-600',
    dotColor: 'bg-emerald-600',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50/30',
    departments: [
      "Pedagogika va psixologiya kafedrasi",
      "Maktabgacha ta'lim kafedrasi"
    ],
    count: '2 ta kafedra'
  },
  {
    title: 'III. Filologiya fakulteti',
    icon: BookType,
    color: 'text-purple-600',
    dotColor: 'bg-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50/30',
    departments: [
      "Rus tili va adabiyoti kafedrasi",
      "O'zbek tili va adabiyoti kafedrasi",
      "Xorijiy filologiya kafedrasi"
    ],
    count: '3 ta kafedra'
  },
  {
    title: "IV. Boshlang'ich ta'lim fakulteti",
    icon: Pencil,
    color: 'text-orange-500',
    dotColor: 'bg-orange-500',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50/30',
    departments: [
      "Boshlang'ich ta'lim metodikasi kafedrasi",
      "Boshlang'ich ta'lim nazariyasi kafedrasi"
    ],
    count: '2 ta kafedra'
  },
  {
    title: 'V. Ijtimoiy fanlar fakulteti',
    icon: Landmark,
    color: 'text-teal-600',
    dotColor: 'bg-teal-600',
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50/30',
    departments: [
      "Tarix kafedrasi",
      "Milliy g'oya va falsafa kafedrasi",
      "San'atshunoslik kafedrasi",
      "Jismoniy madaniyat kafedrasi"
    ],
    count: '4 ta kafedra'
  }
];

// ==== izoh: DirectionsTab ma'lumotlari ====
const pieData = [
  { name: "Kunduzgi ta'lim", value: 5164, color: '#0052cc', percent: '62%' },
  { name: "Sirtqi ta'lim", value: 2193, color: '#10b981', percent: '26%' },
  { name: "Ikkinchi oliy mutaxassislik", value: 202, color: '#f97316', percent: '2%' },
  { name: "Magistratura", value: 357, color: '#8b5cf6', percent: '10%' },
];

const directions = {
  kunduzgi: [
    "60110100 - Pedagogika",
    "60110200 - Maktabgacha ta'lim",
    "60110400 - Boshlang'ich ta'lim",
    "60110500 - Tasviriy san'at va muhandislik grafikasi",
    "60110600 - Musiqiy ta'lim",
    "60110700 - O'zbek tili va adabiyoti",
    "60110800 - Ona tili va adabiyoti: rus tili",
    "60110900 - Xorijiy til va adabiyoti: ingliz tili",
    "60111100 - Milliy g'oya, ma'naviyat asoslari va huquq ta'limi",
    "60111200 - Jismoniy madaniyat",
    "60111300 - Texnologik ta'lim",
    "60220300 - Tarix",
    "60510100 - Biologiya",
    "60530100 - Kimyo",
    "60530200 - Geografiya",
    "60530500 - Fizika",
    "60530700 - Astronomiya",
    "60540100 - Matematika",
    "60540200 - Amaliy matematika"
  ],
  sirtqi: [
    "60110100 - Pedagogika",
    "60110200 - Maktabgacha ta'lim",
    "60110400 - Boshlang'ich ta'lim",
    "60110500 - Tasviriy san'at",
    "60110600 - Musiqiy ta'lim",
    "60111200 - Jismoniy madaniyat",
    "60111300 - Texnologik ta'lim",
    "60220300 - Tarix",
    "60540100 - Matematika"
  ],
  magistratura: [
    "70110101 - Pedagogika nazariyasi va tarixi",
    "70110201 - Ta'lim va tarbiya nazariyasi",
    "70110501 - Tasviriy san'at",
    "70111202 - Muhandislik grafikasi",
    "70111301 - Musiqa ta'limi",
    "70111101 - Ijtimoiy-gumanitar fanlar",
    "70112201 - Jismoniy tarbiya",
    "70220303 - Tarix",
    "70530510 - Fizika",
    "70540104 - Matematika"
  ]
};

// ==== izoh: MastersGrid ma'lumotlari ====
const mastersData = [
  "70110101 - Pedagogika nazariyasi va tarixi",
  "70110201 - Ta'lim va tarbiya nazariyasi va metodikasi (maktabgacha ta'lim)",
  "70110501 - Ta'lim va tarbiya nazariyasi va metodikasi (boshlang'ich ta'lim)",
  "70111202 - Muhandislik grafikasi va dizayn nazariyasi",
  "70111301 - Musiqa ta'limi va san'at",
  "70111101 - Ijtimoiy-gumanitar fanlarni o'qitish metodikasi (ma'naviyat asoslari)",
  "70112201 - Jismoniy tarbiya va sport mashg'ulotlari nazariyasi va metodikasi",
  "70112301 - Ta'lim va tarbiya nazariyasi va metodikasi (texnologik ta'lim)",
  "70220303 - Ijtimoiy-gumanitar fanlarni o'qitish metodikasi (tarix)",
  "70530510 - Aniq va tabiiy fanlarni o'qitish metodikasi (fizika va astronomiya)",
  "70540104 - Aniq va tabiiy fanlarni o'qitish metodikasi (matematika)"
];

export default function InfographicPage() {
  const [activeTab, setActiveTab] = useState('kunduzgi');

  const tabs = [
    { id: 'kunduzgi', label: "Kunduzgi ta'lim (19)" },
    { id: 'sirtqi', label: "Sirtqi ta'lim (9)" },
    { id: 'magistratura', label: "Magistratura (11)" }
  ];

  const currentList = directions[activeTab] || [];
  const halfway = Math.ceil(currentList.length / 2);
  const leftCol = currentList.slice(0, halfway);
  const rightCol = currentList.slice(halfway);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-12">
      
      {/* ==== izoh: HeroSection qismi ==== */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 pt-8">
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-sm">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6 inline-flex justify-center items-center">
            <img src={logoImg} alt="UrDPI Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
          </div>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-8 max-w-3xl font-bold">
            Urganch davlat pedagogika instituti O‘zbekiston Respublikasi Prezidentining 2022-yil 21-iyundagi "Pedagogik ta'lim sifatini oshirish va pedagog kadrlar tayyorlovchi oliy ta'lim muassasalari faoliyatini yanada rivojlantirish chora-tadbirlari to'g'risida"gi 289-sonli qaroriga asosan tashkil qilingan.
          </p>
          

        </div>
      </div>
      
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ==== izoh: HistoryTimeline qismi ==== */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full h-full">
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-6 h-6 text-blue-800" />
                <h2 className="text-xl font-bold text-slate-800">Institut tarixi</h2>
              </div>

              <div className="relative pl-3">
                <div className="absolute left-[15px] top-2 bottom-4 w-[2px] bg-blue-200/60"></div>
                <div className="flex flex-col gap-8">
                  {timelineData.map((item, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-[-4px] top-1.5 w-[14px] h-[14px] rounded-full bg-white border-2 border-blue-500 z-10"></div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">{item.year}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* ==== izoh: StatsGrid qismi ==== */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topStats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center justify-center text-center">
                    <stat.icon className={`w-8 h-8 mb-3 ${stat.color}`} />
                    <h3 className="text-3xl font-black text-slate-800 mb-1">{stat.value}</h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-pre-line">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-800">Talabalar soni <span className="text-sm font-normal text-slate-500">(2025-2026 o'quv yili)</span></h2>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {studentStats.map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} rounded-xl p-5 flex flex-col items-center text-center border border-slate-100/50`}>
                      <stat.icon className={`w-8 h-8 mb-3 ${stat.color}`} />
                      <h3 className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
                      <p className="text-xs font-medium text-slate-700 whitespace-pre-line">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 border-t border-slate-100 py-3 text-center">
                  <p className="font-bold text-slate-800 text-sm">Jami: 8 317 nafar talaba</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==== izoh: FacultiesGrid qismi ==== */}
        <div className="mt-10">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Fakultetlar</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {faculties.map((fac, idx) => (
                <div key={idx} className={`bg-white rounded-2xl shadow-sm border ${fac.borderColor} overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow`}>
                  <div className={`p-5 pb-4 border-b ${fac.borderColor} ${fac.bgColor} flex flex-col items-center text-center`}>
                    <fac.icon className={`w-10 h-10 mb-4 ${fac.color}`} />
                    <h3 className={`font-bold text-sm ${fac.color} min-h-[40px]`}>{fac.title}</h3>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1 mb-4">
                      {fac.departments.map((dep, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${fac.dotColor}`}></div>
                          <span className="text-xs text-slate-600 leading-tight">{dep}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-center pt-3 border-t border-slate-100">
                      <span className={`text-xs font-bold ${fac.color}`}>{fac.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==== izoh: DirectionsTab qismi ==== */}
        <div className="mt-10">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ta'lim yo'nalishlari</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-col xl:flex-row p-6 gap-8">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    {tabs.find(t => t.id === activeTab)?.label} yo'nalishlari
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <ul className="space-y-2">
                      {leftCol.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                          <span className="text-xs text-slate-700 leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2">
                      {rightCol.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                          <span className="text-xs text-slate-700 leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full xl:w-[320px] shrink-0 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Talabalar taqsimoti</h3>
                  <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-4">
                    <div className="w-[180px] h-[180px] shrink-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} nafar`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <span className="text-xl font-bold text-slate-800 opacity-20">UrDPI</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 justify-center w-full">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: item.color }}></div>
                          <div className="flex flex-col">
                            <span className="text-[11px] text-slate-600 font-medium leading-tight">{item.name}</span>
                            <span className="text-[11px] font-bold text-slate-800">{item.value} nafar ({item.percent})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==== izoh: MastersGrid qismi ==== */}
        <div className="mt-10">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Magistratura mutaxassisliklari (11)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mastersData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <p className="text-[13px] text-slate-700 font-medium leading-snug mt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
