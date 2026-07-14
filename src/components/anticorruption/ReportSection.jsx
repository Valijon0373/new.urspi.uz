import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Mail, ShieldAlert } from 'lucide-react';

export default function ReportSection() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to the server
        alert("Sizning murojaatingiz qabul qilindi!");
        setFormData({ name: '', phone: '', message: '' });
    };

    return (
        <div id="murojaat" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-12 reveal-on-scroll opacity-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0c1f4a] mb-4 flex items-center justify-center gap-3">
                        <ShieldAlert className="w-8 h-8" />
                        Korrupsiya haqida xabar bering
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Agar siz korrupsiya holatiga duch kelsangiz yoki bu haqda ma'lumotga ega bo'lsangiz, quyidagi forma orqali yoki ishonch telefonlariga murojaat qilishingiz mumkin. Murojaatchining shaxsi sir saqlanishi kafolatlanadi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6 reveal-on-scroll opacity-0">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl flex items-center justify-center mb-4">
                                <PhoneCall className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ishonch telefoni</h3>
                            <p className="text-gray-600 mb-4">Tunu-kun xizmat ko'rsatuvchi ishonch telefoni orqali bog'laning:</p>
                            <a href="tel:+998622246132" className="text-2xl font-bold text-[#0c1f4a] hover:text-[#1a2f55] transition">
                                +998 (62) 224-61-32
                            </a>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-[#0c1f4a]/10 text-[#0c1f4a] rounded-xl flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Elektron pochta</h3>
                            <p className="text-gray-600 mb-4">Xat va hujjatlarni quyidagi elektron manzilga yuborishingiz mumkin:</p>
                            <a href="mailto:info@urspi.uz" className="text-lg font-bold text-[#0c1f4a] hover:text-[#1a2f55] transition">
                                info@urspi.uz
                            </a>
                        </div>
                    </div>

                    {/* Report Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10 reveal-on-scroll opacity-0" style={{ animationDelay: '150ms' }}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Murojaat yuborish</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">F.I.SH. (Ixtiyoriy)</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c1f4a]/30 focus:border-[#0c1f4a] transition-shadow outline-none"
                                        placeholder="Ism va familiyangiz"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon raqamingiz (Ixtiyoriy)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c1f4a]/30 focus:border-[#0c1f4a] transition-shadow outline-none"
                                        placeholder="+998"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Murojaat matni *</label>
                                <textarea
                                    id="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0c1f4a]/30 focus:border-[#0c1f4a] transition-shadow outline-none resize-none"
                                    placeholder="Korrupsiya holati bo'yicha batafsil ma'lumot bering..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-4 bg-[#0c1f4a] hover:bg-[#1a2f55] text-white font-bold rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#0c1f4a]/50"
                            >
                                Murojaatni yuborish
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
