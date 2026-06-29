import { Eye, ChevronRight } from 'lucide-react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import urspiImage from '../../../assets/images/urspi_new.png'

const categories = [
    "Sport",
    "Xalqaro hamkorlik",
    "Olimpiadalar",
    "Tadbirlar",
    "O'quv seminar",
    "Ta'lim granti",
    "Bitiruvchilar"
]

const newsItems = [
    {
        id: 1,
        title: "Oliy ta'lim, fan va innovatsiyalar vaziri Qo'ng'irotboy Sharipov UrDPI yangi o'quv binosi va zamonaviy sharoitlari bilan tanishdi",
        image: urspiImage,
        views: 356,
        date: "20-06-2026",
        isFeatured: true,
    },
    {
        id: 2,
        title: "URDPI REKTORI XITOYNING NANKIN AUDIT UNIVERSITETI VAKILLARI BILAN HAMKORLIKNI MUHOKAMA QILDI",
        image: urspiImage,
        views: 358,
        date: "17-06-2026",
        isFeatured: false,
    },
    {
        id: 3,
        title: "UrDPI va TDYU o'rtasida strategik hamkorlik memorandumi imzolandi",
        image: urspiImage,
        views: 329,
        date: "17-06-2026",
        isFeatured: false,
    },
    {
        id: 4,
        title: "URGANCH DAVLAT PEDAGOGIKA INSTITUTI YANA RESPUBLIKA MINBARIDA ET'IROF ETILDI",
        image: urspiImage,
        views: 151,
        date: "15-06-2026",
        isFeatured: false,
    },
    {
        id: 5,
        title: "UrDPIda \"TALABA FEST\" FESTIVALI YUQORI SAVIYADA O'TKAZILDI",
        image: urspiImage,
        views: 506,
        date: "12-06-2026",
        isFeatured: false,
    }
]

export default function News() {
    const featuredItem = newsItems.find(item => item.isFeatured)
    const regularItems = newsItems.filter(item => !item.isFeatured)

    return (
        <section className="w-full bg-white py-12 md:py-16 text-left" aria-labelledby="news-heading">
            <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">

                {/* Header section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                    <h2 id="news-heading" className="font-black tracking-tight" style={{ color: '#1d4ed8', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: '1.1' }}>
                        So'nggi yangiliklar
                    </h2>

                    {/* Categories list */}
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-[#0c1f4a] transition-all hover:bg-slate-200 active:scale-95 whitespace-nowrap cursor-pointer"
                            >
                                {cat}
                            </button>
                        ))}
                        <a
                            href="#"
                            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors ml-2 whitespace-nowrap"
                        >
                            Barchasi <ChevronRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Large Featured Card */}
                    {featuredItem && (
                        <article className="group relative aspect-[4/3] min-h-[380px] overflow-hidden rounded-3xl shadow-lg transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl lg:h-full lg:min-h-[500px]">
                            {/* Image */}
                            <img
                                src={featuredItem.image}
                                alt={featuredItem.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Bottom Overlay Info */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-stretch min-h-[140px] sm:min-h-[160px]">
                                {/* Vertical Blue Bar */}
                                <div className="bg-[#1d4ed8] text-white font-bold uppercase tracking-wider text-[10px] sm:text-xs flex items-center justify-center w-10 sm:w-12 shrink-0 select-none [writing-mode:vertical-lr] rotate-180 border-r border-white/10">
                                    Yangiliklar
                                </div>

                                {/* Content Panel */}
                                <div className="flex-1 bg-black/20 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-between text-white">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold leading-snug group-hover:text-blue-300 transition-colors line-clamp-3">
                                        <a href="#">{featuredItem.title}</a>
                                    </h3>

                                    {/* Meta details */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold tracking-wider uppercase">
                                            <Eye className="h-3.5 w-3.5" />
                                            {featuredItem.views}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase">
                                            <FaRegCalendarAlt className="h-4 w-4" />
                                            {featuredItem.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}

                    {/* Right Column: 2x2 Grid of Smaller Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {regularItems.map(item => (
                            <article
                                key={item.id}
                                className="group relative aspect-[4/3] min-h-[180px] overflow-hidden rounded-2xl shadow-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Bottom Overlay Info */}
                                <div className="absolute bottom-0 left-0 right-0 flex items-stretch min-h-[110px]">
                                    {/* Vertical Blue Bar */}
                                    <div className="bg-[#1d4ed8] text-white font-bold uppercase tracking-wider text-[9px] flex items-center justify-center w-8 shrink-0 select-none [writing-mode:vertical-lr] rotate-180 border-r border-white/10">
                                        Yangiliklar
                                    </div>

                                    {/* Content Panel */}
                                    <div className="flex-1 bg-black/20 backdrop-blur-sm p-3 flex flex-col justify-between text-white">
                                        <h3 className="text-xs sm:text-xs md:text-sm font-bold leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                                            <a href="#">{item.title}</a>
                                        </h3>

                                        {/* Meta details */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold">
                                                <Eye className="h-3 w-3" />
                                                {item.views}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold">
                                                <FaRegCalendarAlt className="h-3.5 w-3.5" />
                                                {item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
