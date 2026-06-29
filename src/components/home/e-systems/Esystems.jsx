import React from 'react'
import { ChevronRight, Mail, BarChart, GraduationCap, Eye, Book, Wifi, Briefcase } from 'lucide-react'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { VscFeedback } from 'react-icons/vsc'
import { BsCameraVideo } from 'react-icons/bs'
import { RiMailSendLine } from 'react-icons/ri'

const systems = [
    {
        id: 1,
        title: "HEMIS Student axborot tizimi",
        icon: GraduationCap,
        link: "https://hemis.urspi.uz/dashboard/login"
    },
    {
        id: 2,
        title: "AKBT Elektron kutubxona",
        icon: Book,
        link: "https://akbt.urspi.uz/"
    },
    {
        id: 3,
        title: "Elektron pochta",
        icon: Mail,
        link: "https://webmail.urspi.uz/webmail/login/"
    },
    {
        id: 4,
        title: "Feedback Platformasi",
        icon: VscFeedback,
        link: "https://feedback.urspi.uz/"
    },
    {
        id: 5,
        title: "110 Ballik Platforma",
        icon: BarChart,
        link: "https://110b.urspi.uz/"
    },
    {
        id: 6,
        title: "Onlayn kuzatuv",
        icon: BsCameraVideo,
        link: "https://live.urspi.uz/"
    },
    {
        id: 7,
        title: "Masofaviy ta'lim",
        icon: Wifi,
        link: "https://moodle.urspi.uz/"
    },
    {
        id: 8,
        title: "Rektorga murojaat",
        icon: RiMailSendLine,
        link: "#"
    }
]

export default function Esystems() {
    return (
        <section className="w-full bg-[#f4f7fb] py-12 md:py-16 text-center" aria-labelledby="esystems-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3 md:gap-4 text-[#1d4ed8]">
                        <HiOutlineDesktopComputer style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#1d4ed8' }} />
                        <h2 id="esystems-heading" className="font-black tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                            Axborot tizimlari
                        </h2>
                    </div>
                    <a href="#" className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        Barchasi <ChevronRight className="h-4 w-4 ml-0.5" />
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {systems.map(sys => {
                        const Icon = sys.icon
                        return (
                            <a
                                key={sys.id}
                                href={sys.link}
                                className="group relative bg-white rounded-[1.5rem] p-7 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md min-h-[200px]"
                            >
                                {/* Top Blue Dash */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-blue-500 rounded-b-sm transition-all duration-300 group-hover:w-40 group-hover:bg-blue-600" />

                                {/* Icon Container */}
                                <div className="w-16 h-16 flex items-center justify-center rounded-[18px] bg-blue-50/80 text-blue-500 mb-5 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white">
                                    <Icon className="w-7 h-7 transition-transform duration-500 group-hover:rotate-[360deg]" {...(sys.icon === VscFeedback || sys.icon === BsCameraVideo || sys.icon === RiMailSendLine ? {} : { strokeWidth: 2 })} />
                                </div>

                                {/* Text */}
                                <h3 className="text-[14px] leading-snug font-medium text-slate-600 transition-colors duration-300 group-hover:text-blue-700 max-w-[90%]">
                                    {sys.title}
                                </h3>
                            </a>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
