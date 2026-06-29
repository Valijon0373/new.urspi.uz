import { ChevronRight } from 'lucide-react'
import { GrAnnounce } from 'react-icons/gr'
import { FaRegCalendarAlt } from 'react-icons/fa'
import urspiImage from '../../../assets/images/urspi_new.png'

const announcements = [
    {
        id: 1,
        date: "09.06.2026",
        title: "Rajabov Tolib Toshtemir o'g'lining biologiya fanlari bo'yicha falsafa...",
        image: urspiImage
    },
    {
        id: 2,
        date: "04.06.2026",
        title: "Adizova Zuhro Ma'rif qizining texnika fanlari bo'yicha falsafa doktor...",
        image: urspiImage
    },
    {
        id: 3,
        date: "03.06.2026",
        title: "Jabbarova Aziza Shixnazarovnaning pedagogika fanlari bo'yicha falsafa...",
        image: urspiImage
    },
    {
        id: 4,
        date: "03.06.2026",
        title: "Jo'rayeva Laylo Jiyanqul qizining filologiya fanlari bo'yicha falsafa...",
        image: urspiImage
    }
]

export default function Announcement() {
    return (
        <section className="w-full bg-slate-50 py-12 md:py-16 text-left" aria-labelledby="announcement-heading">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 md:gap-4 text-[#0c1f4a]">
                        <GrAnnounce style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', color: '#0c1f4a' }} />
                        <h2 id="announcement-heading" className="font-black tracking-tight" style={{ color: '#0c1f4a', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                            E'lonlar
                        </h2>
                    </div>
                    <a href="#" className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        Barchasi <ChevronRight className="h-4 w-4 ml-0.5" />
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {announcements.map(item => (
                        <article
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative h-[220px] w-full overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt="Announcement"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                                />
                                {/* Megaphone Icon overlay */}
                                <div className="absolute top-3 left-3 rounded-lg bg-[#ebe9e1] p-2 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105">
                                    <GrAnnounce className="h-8 w-8 text-[#0c1f4a]" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col bg-white p-5">
                                <div className="flex items-center font-medium mb-2.5">
                                    <FaRegCalendarAlt className="h-4 w-4 mr-2 text-amber-500" />
                                    <span className="text-[14px] text-[#0c1f4a]">{item.date}</span>
                                </div>
                                <h3 className="line-clamp-3 text-[14px] font-medium leading-[1.5] text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                                    {item.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
