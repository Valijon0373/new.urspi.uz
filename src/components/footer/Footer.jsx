import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { FiSend, FiInstagram, FiYoutube, FiFacebook } from 'react-icons/fi'
import { IoBusOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo1.jpg'

export default function Footer() {
    const { t } = useTranslation()
    const location = useLocation()
    const isGreenTheme = location.pathname.includes('/green-institute')
    
    return (
        <footer className={`w-full py-10 md:py-16 text-white font-medium text-sm transition-colors duration-500 ${isGreenTheme ? 'bg-[#022c22]' : 'bg-[#0a3161]'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Column 1: Contacts & Logo */}
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center gap-4">
                            <img src={logo} alt="UrDPI Logo" className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full shadow-sm bg-white" />
                            <h3 className="font-bold text-[15px] leading-snug max-w-[200px] uppercase tracking-wide whitespace-pre-line">
                                {t('footer.institute_name')}
                            </h3>
                        </div>

                        <div className="flex flex-col space-y-4 pt-2 text-[#e2e8f0] text-base">
                            <a href="tel:+998622291840" className="flex items-center hover:text-white transition-colors">
                                <Phone className="w-5 h-5 mr-3 shrink-0" />
                                (+998) 62 229-18-40
                            </a>
                            <a href="mailto:study_info@urspi.uz" className="flex items-center hover:text-white transition-colors">
                                <Mail className="w-5 h-5 mr-3 shrink-0" />
                                study_info@urspi.uz
                            </a>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                                <span>
                                    {t('footer.address')}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <IoBusOutline className="w-5 h-5 mr-3 shrink-0" />
                                7, 18, 19
                            </div>
                        </div>
                    </div>



                    {/* Column 3: Map */}
                    <div className="w-full h-[220px] md:h-[260px] rounded-md overflow-hidden shadow-sm bg-white border-2 border-white/10">
                        <iframe
                            src="https://www.google.com/maps?q=41.567223,60.622521&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="UrSPI Map"
                        ></iframe>
                    </div>

                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10 hover:border-white transition-all text-white">
                        <FiSend className="w-5 h-5 ml-0.5 mt-0.5" />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10 hover:border-white transition-all text-white">
                        <FiInstagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10 hover:border-white transition-all text-white">
                        <FiYoutube className="w-6 h-6" />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10 hover:border-white transition-all text-white">
                        <FiFacebook className="w-5 h-5" />
                    </a>
                </div>
                <div className="text-white/90 font-semibold tracking-wider text-[15px]">
                    UrSPI | RTTM Jamoasi | {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    )
}
