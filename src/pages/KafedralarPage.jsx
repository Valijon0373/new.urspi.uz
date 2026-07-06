import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const facultiesWithDepartments = [
  {
    id: 1,
    name: 'FILOLOGIYA FAKULTETI',
    departments: [
      'RUS TILI VA ADABIYOTI KAFEDRASI',
      'O\'ZBEK TILI VA ADABIYOTI KAFEDRASI',
      'XORIJIY FILOLOGIYA KAFEDRASI'
    ]
  },
  {
    id: 2,
    name: 'PEDAGOGIKA FAKULTETI',
    departments: [
      'PEDAGOGIKA VA PSIXOLOGIYA KAFEDRASI',
      'MAKTABGACHA TA\'LIM KAFEDRASI'
    ]
  },
  {
    id: 3,
    name: 'ANIQ VA TABIIY FANLAR FAKULTETI',
    departments: [
      'MATEMATIKA VA KOMPYUTER TEXNOLOGIYALARI KAFEDRASI',
      'TABIIY FANLAR KAFEDRASI',
      'FIZIKA VA ASTRONOMIYA KAFEDRASI',
      'TEXNOLOGIK TA\'LIM KAFEDRASI'
    ]
  },
  {
    id: 4,
    name: 'BOSHLANG\'ICH TA\'LIM FAKULTETI',
    departments: [
      'BOSHLANG\'ICH TA\'LIM METODIKASI KAFEDRASI',
      'BOSHLANG\'ICH TA\'LIM NAZARIYASI KAFEDRASI'
    ]
  },
  {
    id: 5,
    name: 'IJTIMOIY VA AMALIY FANLAR FAKULTETI',
    departments: [
      'TARIX KAFEDRASI',
      'MILLIY G\'OYA VA FALSAFA KAFEDRASI',
      'SAN\'ATSHUNOSLIK KAFEDRASI',
      'JISMONIY MADANIYAT KAFEDRASI'
    ]
  }
];

const sidebarLinks = [
  { name: 'Institut tarixi', path: '#' },
  { name: 'Institut nizomi', path: '#' },
  { name: 'Rahbariyat', path: '/rahbariyat' },
  { name: 'Fakultetlar', path: '/fakultetlar' },
  { name: 'Kafedralar', path: '/kafedralar' },
  { name: 'Markaz va bo\'limlar', path: '#' },
];

export default function KafedralarPage() {
  const location = useLocation();

  return (
    <div className="flex-grow bg-white flex flex-col min-h-[calc(100vh-200px)]">
      {/* Header Banner */}
      <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-white font-medium">Kafedralar</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar */}
            <div className="w-full lg:w-[300px] shrink-0 border border-slate-200 rounded-sm overflow-hidden">
              <div className="bg-[#0c1f4a] px-5 py-4">
                <h3 className="font-bold text-white text-[15px] uppercase tracking-wide">Tuzilma</h3>
              </div>
              <ul className="flex flex-col">
                {sidebarLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={index} className="border-b border-slate-100 last:border-b-0">
                      <Link 
                        to={link.path}
                        className={`block px-5 py-3.5 text-[14px] transition-colors duration-200 ${
                          isActive 
                            ? 'text-blue-600 font-medium bg-blue-50/30' 
                            : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
              <div className="mb-8 border-b-2 border-slate-200 pb-3">
                <h1 className="text-2xl md:text-[28px] font-bold text-[#0c1f4a]">Kafedralar</h1>
              </div>

              <div className="flex flex-col gap-6">
                {facultiesWithDepartments.map((faculty) => (
                  <div key={faculty.id} className="flex flex-col w-full">
                    {/* Faculty Header */}
                    <div className="bg-[#0c1f4a] text-white px-5 py-3.5 font-medium text-[14px] sm:text-[15px] uppercase tracking-wide">
                      {faculty.name}
                    </div>
                    {/* Departments List */}
                    <div className="flex flex-col w-full bg-white">
                      {faculty.departments.map((dep, idx) => (
                        <Link 
                          to="/kafedra-xodimlari"
                          key={idx} 
                          className="block border border-t-0 border-slate-200 px-5 py-3.5 text-[13px] sm:text-[14px] text-[#5b87b7] font-medium transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-200/80 hover:-translate-y-[2px] hover:text-[#0c1f4a] cursor-pointer relative hover:z-10"
                        >
                          {dep}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
