import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function AnnouncementDetailPage() {
    const { id } = useParams();

    // Mock data for the specific announcement
    const announcement = {
        id,
        title: "Raximova Shaxnoza Raximovnaning filologiya fanlari bo'yicha falsafa doktori (PhD) dissertatsiyasi ishi himoyasi to'g'risida",
        date: "02.06.2026",
        content: `«Kolum Makkenn prozasida tarixiy mojarolar va shaxsiy tajriba ruhiy jarohatlar triggeri sifatida» mavzusida
**Raximova Shaxnoza Raximovnaning** 10.00.04 - Yevropa, Amerika va Avstraliya xalqlari tili va adabiyoti ixtisosligidagi **«Kolum Makkenn prozasida tarixiy mojarolar va shaxsiy tajriba ruhiy jarohatlar triggeri sifatida»** mavzusidagi filologiya fanlari bo'yicha falsafa doktori (PhD) dissertatsiyasining himoyasi Buxoro davlat universiteti huzuridagi ilmiy darajalar beruvchi DSc.03/2025.27.12.Fil.08.08 raqamli Ilmiy kengashning 2026-yil 23-iyun kuni soat 11:30 dagi majlisida bo'lib o'tadi.`,
        address: "200118, Buxoro shahri, M. Iqbol ko'chasi, 11-uy. Buxoro davlat universiteti, Bosh binosi, kichik majlislar yig'ingohi.",
        tel: "(99865) 221-29-14",
        fax: "(99865) 221-57-27",
        email: "buxdu_rektor@buxdu.uz"
    };

    return (
        <main className="flex-1 bg-slate-50 pb-16">
            {/* Header Banner */}
            <div className="w-full bg-[#0c1f4a] py-8 md:py-12 flex flex-col justify-center">
                <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
                    <h1 className="text-3xl font-bold text-white mb-4">E'lonlar</h1>
                    <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <li className="inline-flex items-center shrink-0">
                                <Link to="/" className="hover:text-white transition-colors">
                                    Bosh sahifa
                                </Link>
                            </li>
                            <li className="shrink-0">
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 mx-1" />
                                    <Link to="/announcements" className="hover:text-white transition-colors">
                                        E'lonlar
                                    </Link>
                                </div>
                            </li>
                            <li className="truncate">
                                <div className="flex items-center truncate">
                                    <ChevronRight className="w-4 h-4 mx-1 shrink-0" />
                                    <span className="text-white font-medium truncate">{announcement.title}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Content Card */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 md:p-10">
                    
                    {/* Date Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 text-blue-600 font-medium mb-6">
                        <FaRegCalendarAlt className="mr-2" />
                        {announcement.date}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-semibold text-[#0c1f4a] leading-snug mb-6">
                        {announcement.title}
                    </h2>

                    {/* Divider */}
                    <hr className="border-gray-200 mb-6" />

                    {/* Body Text */}
                    <div className="text-gray-700 leading-relaxed space-y-4 text-[15px]">
                        <p>
                            «Kolum Makkenn prozasida tarixiy mojarolar va shaxsiy tajriba ruhiy jarohatlar triggeri sifatida» mavzusida
                            <br />
                            <strong>Raximova Shaxnoza Raximovnaning</strong> 10.00.04 – Yevropa, Amerika va Avstraliya xalqlari tili va adabiyoti ixtisosligidagi <strong>«Kolum Makkenn prozasida tarixiy mojarolar va shaxsiy tajriba ruhiy jarohatlar triggeri sifatida»</strong> mavzusidagi filologiya fanlari bo'yicha falsafa doktori (PhD) dissertatsiyasining himoyasi Buxoro davlat universiteti huzuridagi ilmiy darajalar beruvchi DSc.03/2025.27.12.Fil.08.08 raqamli Ilmiy kengashning 2026-yil 23-iyun kuni soat 11:30 dagi majlisida bo'lib o'tadi.
                        </p>
                        
                        <p>
                            <strong>Manzil:</strong> {announcement.address}
                        </p>
                        <p>
                            <strong>Tel.:</strong> {announcement.tel}; <strong>faks:</strong> {announcement.fax}
                        </p>
                        <p>
                            <strong>e-mail:</strong> <a href={`mailto:${announcement.email}`} className="text-blue-600 hover:underline">{announcement.email}</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
