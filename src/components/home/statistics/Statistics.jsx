import React, { useState, useEffect } from 'react'
import { Briefcase } from 'lucide-react'
import { FaBookOpenReader } from 'react-icons/fa6'
import { PiStudentFill, PiUsers } from 'react-icons/pi'
import slider1 from '../../../assets/images/slider1.jpg'
import slider2 from '../../../assets/images/slider2.jpg'

export default function Statistics() {
    const [bgIndex, setBgIndex] = useState(0)
    const bgImages = [slider1, slider2]

    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex(prev => (prev === 0 ? 1 : 0))
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const StatCard = ({ title, value, Icon, iconClassName, titleClassName }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md cursor-pointer flex-1">
            <div className="flex justify-between items-start mb-4 text-left">
                <p className={`text-[#0c1f4a] text-[15px] sm:text-base font-semibold pr-2 ${titleClassName || ''}`}>
                    {title}
                </p>
                <Icon className={`text-blue-400 opacity-70 shrink-0 ${iconClassName || 'w-10 h-10'}`} strokeWidth={1.5} />
            </div>
            <div className="text-left mt-auto">
                <span className="text-3xl md:text-4xl font-bold text-[#1d4ed8]">
                    {value}
                </span>
            </div>
        </div>
    )

    return (
        <section className="w-full bg-[#f4f7f9] py-12 md:py-16 text-center" aria-labelledby="statistics-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                
                {/* Header */}
                <div className="flex items-center justify-center mb-10">
                    <h2 id="statistics-heading" className="font-black tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                        - Statistika -
                    </h2>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[340px]">
                    
                    {/* Left Column */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <StatCard title="Yo'nalishlar" value="519" Icon={FaBookOpenReader} />
                        <StatCard title="Talabalar soni" value="17280" Icon={PiUsers} />
                    </div>

                    {/* Middle Column (Slider) */}
                    <div className="relative rounded-2xl overflow-hidden shadow-sm lg:col-span-2 min-h-[250px] lg:min-h-full">
                        {bgImages.map((img, idx) => (
                            <div 
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === bgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <img src={img} alt="Universitet ko'rinishi" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <StatCard title="Professor-o'qituvchilar soni" value="781" Icon={PiStudentFill} />
                        <StatCard title="Ilmiy salohiyat" value="67.6%" Icon={Briefcase} />
                    </div>

                </div>
            </div>
        </section>
    )
}
