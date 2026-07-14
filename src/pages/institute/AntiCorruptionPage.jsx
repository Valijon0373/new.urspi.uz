import { useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import JusticeScale3D from '../../components/anticorruption/JusticeScale3D';
import ReportSection from '../../components/anticorruption/ReportSection';
import DocumentsSection from '../../components/anticorruption/DocumentsSection';

export default function AntiCorruptionPage() {
    // Scroll animation logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Smooth scroll to hash
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#1d4ed8 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left reveal-on-scroll opacity-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0c1f4a]/5 border border-[#0c1f4a]/10 text-[#0c1f4a] font-medium text-sm mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#0c1f4a] animate-pulse"></span>
                                Korrupsiyasiz ta'lim
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Adolat va shaffoflik — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0c1f4a] to-blue-500">bosh mezonimiz</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Urganch davlat pedagogika institutida korrupsiyaga o'rin yo'q. Biz halol va adolatli ta'lim tizimini yaratish yo'lida barchani hamkorlikka chorlaymiz.
                            </p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <a href="#murojaat" className="px-8 py-4 bg-[#0c1f4a] hover:bg-[#1a2f55] text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
                                    Murojaat qilish
                                </a>
                                <a href="#hujjatlar" className="px-8 py-4 bg-white hover:bg-slate-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all hover:border-gray-300">
                                    Hujjatlar bilan tanishish
                                </a>
                            </div>
                        </div>

                        {/* 3D Scale Component */}
                        <div className="reveal-on-scroll opacity-0" style={{ animationDelay: '200ms' }}>
                            <JusticeScale3D />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <ReportSection />
            <DocumentsSection />
            
            <Footer />
        </div>
    );
}
