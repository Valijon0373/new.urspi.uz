import React from 'react'
import { ChevronRight, Users, Layers } from 'lucide-react'
import { BsInfoCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import facultyImg from '../assets/images/logo1.jpg' // Generic placeholder for faculty image

const faculties = [
  { id: 1, name: 'Filologiya Fakulteti' },
  { id: 2, name: 'Pedagogika Fakulteti' },
  { id: 3, name: 'Aniq va tabiiy fanlar Fakulteti' },
  { id: 4, name: 'Ijtimoiy va amaliy fanlar Fakulteti' },
  { id: 5, name: 'Boshlang\'ich ta\'lim Fakulteti' },
]

const FacultyCard = ({ faculty }) => (
  <div className="w-full h-full bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden flex flex-col xl:flex-row items-start p-5 gap-5 xl:gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/60 hover:-translate-y-0.5">
    {/* Left: Image Frame */}
    <div className="w-full xl:w-[180px] shrink-0 self-start flex justify-center mt-2 xl:mt-4">
      <div className="w-[150px] sm:w-[180px] aspect-square rounded-full overflow-hidden mx-auto xl:mx-0 shadow-sm border border-slate-100">
        <img
          src={facultyImg}
          alt={faculty.name}
          className="w-full h-full object-cover rounded-full object-center"
        />
      </div>
    </div>

    {/* Right: Content */}
    <div className="w-full flex flex-col justify-start flex-1 h-full">
      <div className="mb-4 text-center xl:text-left">
        <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50/50 text-[#3b82f6] border border-blue-200/60 text-[12px] font-semibold mb-3 leading-tight">
          Fakultet
        </span>
        <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight">
          {faculty.name}
        </h3>
      </div>

      <div className="mt-auto pt-2 space-y-2">
        <Link to="/fakultet-xodimlari" className="flex items-center justify-center xl:justify-start gap-2 w-full px-4 py-2 bg-blue-50 text-[#0c1f4a] font-semibold text-[13px] rounded-xl hover:bg-[#0c1f4a] hover:text-white transition-all duration-300 border border-blue-100 shadow-sm active:scale-95">
          <Users size={16} />
          Xodimlar
        </Link>
        <button className="flex items-center justify-center xl:justify-start gap-2 w-full px-4 py-2 bg-blue-50 text-[#0c1f4a] font-semibold text-[13px] rounded-xl hover:bg-[#0c1f4a] hover:text-white transition-all duration-300 border border-blue-100 shadow-sm active:scale-95">
          <Layers size={16} />
          Kafedralar
        </button>
        <button className="flex items-center justify-center xl:justify-start gap-2 w-full px-4 py-2 bg-blue-50 text-[#0c1f4a] font-semibold text-[13px] rounded-xl hover:bg-[#0c1f4a] hover:text-white transition-all duration-300 border border-blue-100 shadow-sm active:scale-95">
          <BsInfoCircle size={16} />
          Batafsil
        </button>
      </div>
    </div>
  </div>
)

export default function FakultetlarPage() {
  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
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
                  <span className="text-white font-medium">Fakultetlar</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 flex flex-col flex-grow">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0c1f4a]">Fakultetlar</h1>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Urganch davlat pedagogika institutidagi mavjud fakultetlar va ularning tuzilmasi bilan tanishing.</p>
          </div>

          {/* 4 ta card - 2 tadan 2 ta ustun shaklida */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            <FacultyCard faculty={faculties[0]} />
            <FacultyCard faculty={faculties[1]} />
            <FacultyCard faculty={faculties[2]} />
            <FacultyCard faculty={faculties[3]} />
          </div>

          {/* 5-chi card - o'rtada */}
          <div className="flex justify-center mt-6 xl:mt-8">
            <div className="w-full lg:w-1/2">
              <FacultyCard faculty={faculties[4]} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
