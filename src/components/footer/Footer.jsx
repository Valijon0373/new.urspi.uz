import React from 'react'
import { Phone, Mail, Bus } from 'lucide-react'

export default function Footer() {
    const col1Links = [
        "Institut tarixi",
        "Institut nizomi",
        "Rahbariyat",
        "Fakultetlar",
        "Kafedralar",
        "Markaz va bo`limlar",
        "Jamoatchilik kengashi"
    ]

    const col2Links = [
        "Kengash",
        "Xalqaro hamkorlik",
        "Institutga ishga qabul",
        "Moliya bo`limi",
        "Ilmiy faoliyat",
        "Ma`naviyat"
    ]

    const Bullet = () => (
        <div className="w-1.5 h-1.5 bg-[#0c1f4a] rotate-45 mr-3 shrink-0 relative mt-1.5">
            <div className="absolute inset-0 m-auto w-[3px] h-[3px] bg-[#e2e8f0] rounded-full"></div>
        </div>
    )

    return (
        <footer className="w-full bg-[#e2e8f0] py-12 text-[#0c1f4a] font-medium text-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    {/* Column 1: Contacts */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-bold text-base mb-2">
                            Urganch davlat pedagogika instituti
                        </h3>
                        <p className="leading-relaxed">
                            O'zbekiston, 220100, Urganch shahri,<br />
                            Gurlan ko'chasi, 1-A uy
                        </p>
                        
                        <div className="flex flex-col space-y-3 mt-4">
                            <a href="tel:+998622291840" className="flex items-center hover:text-blue-600 transition-colors">
                                <Phone className="w-4 h-4 mr-3 shrink-0" />
                                +998 62 229 18 40
                            </a>
                            <a href="mailto:study_info@urspi.uz" className="flex items-center hover:text-blue-600 transition-colors">
                                <Mail className="w-4 h-4 mr-3 shrink-0" />
                                study_info@urspi.uz
                            </a>
                            <div className="flex items-center">
                                <Bus className="w-4 h-4 mr-3 shrink-0" />
                                7, 18, 19
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Links 1 */}
                    <div className="flex flex-col space-y-3 pt-1">
                        {col1Links.map((link, idx) => (
                            <a key={idx} href="#" className="flex items-start hover:text-blue-600 transition-colors group">
                                <Bullet />
                                <span>{link}</span>
                            </a>
                        ))}
                    </div>

                    {/* Column 3: Links 2 */}
                    <div className="flex flex-col space-y-3 pt-1">
                        {col2Links.map((link, idx) => (
                            <a key={idx} href="#" className="flex items-start hover:text-blue-600 transition-colors group">
                                <Bullet />
                                <span>{link}</span>
                            </a>
                        ))}
                    </div>

                    {/* Column 4: Map */}
                    <div className="w-full h-[220px] rounded-md overflow-hidden shadow-sm bg-white pt-1">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d2975.337579133644!2d60.622521!3d41.567223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41dfc92842c22829%3A0x6b44357c32b535d4!2sUrganch%20davlat%20pedagogika%20instituti!5e0!3m2!1sru!2s!4v1700000000000!5m2!1sru!2s" 
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
            
            {/* Bottom bar if needed */}
            {/* <div className="mt-12 border-t border-[#0c1f4a]/20 pt-6 text-center text-xs opacity-80">
                © {new Date().getFullYear()} Urganch davlat pedagogika instituti. Barcha huquqlar himoyalangan.
            </div> */}
        </footer>
    )
}
