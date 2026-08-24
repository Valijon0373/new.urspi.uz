import { MapPin, ChevronDown, ChevronRight, Languages, Menu, X, Search } from 'lucide-react'
import { BsTelegram } from 'react-icons/bs'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import { TfiYoutube } from 'react-icons/tfi'
import { IoAccessibilityOutline } from 'react-icons/io5'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import bgImg from '../../assets/images/background.jpg'
import uzFlag from '../../assets/images/uz.png'
import ruFlag from '../../assets/images/ru.png'
import enFlag from '../../assets/images/en.png'
import AccessibilityDrawer from './AccessibilityDrawer'

const address =
  "Manzil: O'zbekiston, 220100, Urganch shahri, Gurlan ko'chasi, 1-A uy"

const hoverColors = {
  Telegram: 'hover:bg-sky-500',
  Facebook: 'hover:bg-blue-600',
  Instagram: 'hover:bg-red-500',
  YouTube: 'hover:bg-red-600',
}

const navLinks = [
  {
    labelKey: 'navbar.links.institut',
    href: '#',
    dropdown: [
      { labelKey: 'Institut tarixi', href: '/infographic' },
      { labelKey: 'Institut nizomi', href: '#' },
      { labelKey: 'Rahbariyat', href: '/leadership' },
      { labelKey: 'Fakultetlar', href: '/faculties' },
      { labelKey: 'Kafedralar', href: '/departments' },
      { labelKey: 'Markaz va bo‘limlar', href: '/centers' },
      { labelKey: 'Me\'yoriy hujjatlar', href: '/regulatory-documents' },
    ],
  },
  {
    labelKey: 'navbar.links.activity',
    href: '#',
    dropdown: [
      { labelKey: 'Kengash', href: '#' },
      { labelKey: "Moliya bo'limi", href: '#' },
      { labelKey: "Ma'naviyat", href: '#' },
      { labelKey: 'Institutga Ishga qabul', href: '#' },
      { labelKey: 'Ilmiy va innovatsion faoliyat', href: '#' },
    ],
  },
  {
    labelKey: 'navbar.links.students',
    href: '#',
    dropdown: [
      { labelKey: 'navbar.links.student_life', href: '#' },
      { labelKey: 'navbar.links.scholarships', href: '#' },
      { labelKey: 'navbar.links.dormitory', href: '/dormitory' },
      { labelKey: 'navbar.links.library', href: '#' },
    ],
  },
  {
    labelKey: 'navbar.links.admission',
    href: '#',
    dropdown: [
      { labelKey: 'Bakalavr', href: '/bachelor' },
      { labelKey: 'Magistratura', href: '/master' },
      { labelKey: "O'qishni ko'chirish", href: '#' },
      { labelKey: 'Ikkinchi Mutaxasislik', href: '#' },
      { labelKey: 'Texnikum bituruvchilari', href: '#' },
    ],
  },
  { labelKey: 'navbar.links.green_uni', href: '/green-institute', dropdown: null },
  {
    labelKey: 'navbar.links.foreign',
    href: '#',
    dropdown: [
      { labelKey: 'navbar.links.for_foreign', href: '#' },
      { labelKey: 'navbar.links.lang_courses', href: '#' },
      { labelKey: 'navbar.links.visa', href: '#' },
    ],
  },
  {
    labelKey: 'navbar.links.anticorruption',
    href: '/anti-corruption',
    dropdown: null
  },
  { labelKey: 'navbar.links.stats', href: '#', dropdown: null },
]


function SocialLink({ href, label, children }) {
  const hoverColor = hoverColors[label] || 'hover:bg-white/20'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition ${hoverColor}`}
    >
      {children}
    </a>
  )
}

function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isGreenTheme = location.pathname.includes('/green-institute')

  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpenIdx, setMobileOpenIdx] = useState(null)
  const [mobileSubOpenKey, setMobileSubOpenKey] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const glassNavClass =
    `rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors duration-500 ${isGreenTheme ? 'bg-[#011a14]/80' : 'bg-[#1a2f55]/70'}`

  const openSearch = () => {
    setMenuOpen(false)
    setSearchOpen(true)
  }

  const closeSearch = () => {
    setSearchOpen(false)
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('app-lang', lng)
    setLangOpen(false)
  }

  const currentLang = i18n.language || 'uz'

  return (
    <>
      {/* ── 1. TOP BAR & 2. LOGO ── */}
      <header className="relative w-full">
        {/* ── 1. TOP BAR ── */}
        <div className={`px-4 py-3 lg:px-8 transition-colors duration-500 ${isGreenTheme ? 'bg-[#022c22]' : 'bg-[#0c1f4a]'}`}>
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Burger icon on mobile top bar */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                aria-label={t('navbar.menu')}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Address hidden on mobile, shown on desktop */}
              <p className="hidden lg:flex items-center gap-1.5 text-left text-[11px] leading-snug text-white sm:text-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{t('navbar.address')}</span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex items-center gap-2 lg:gap-3">
                <SocialLink href="https://t.me/UrDPI_UZ" label="Telegram"><BsTelegram className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://www.instagram.com/urspi.uz?igsh=b3Bwc2g0YWoxYnZh" label="Instagram"><FaInstagram className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://www.facebook.com/people/Urganch-Davlat-Pedagogika-Instituti/pfbid0bPNZR2Wy86C9X3wdZFFYaGfzuShapjc1h92dUG1r324CAopcCRSZrKzXCq4ZnEkEl/?mibextid" label="Facebook"><FaFacebookF className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://www.youtube.com/@urspiurspi" label="YouTube"><TfiYoutube className="h-4 w-4" /></SocialLink>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-white transition hover:bg-white/20"
                  aria-label={t('navbar.select_lang')}
                >
                  <img src={currentLang === 'ru' ? ruFlag : currentLang === 'en' ? enFlag : uzFlag} alt="flag" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-semibold uppercase">{currentLang}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div className={`absolute right-0 top-[calc(100%+8px)] z-50 w-32 rounded-xl border border-white/20 py-1.5 shadow-xl backdrop-blur-xl transition-colors duration-500 ${isGreenTheme ? 'bg-[#011a14]/90' : 'bg-[#0c1f4a]/90'}`}>
                    <button onClick={() => changeLanguage('uz')} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white">
                      <img src={uzFlag} alt="UZ" className="w-5 h-5 rounded-full object-cover" />
                      O'zbek
                    </button>
                    <button onClick={() => changeLanguage('ru')} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white">
                      <img src={ruFlag} alt="RU" className="w-5 h-5 rounded-full object-cover" />
                      Русский
                    </button>
                    <button onClick={() => changeLanguage('en')} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white">
                      <img src={enFlag} alt="EN" className="w-5 h-5 rounded-full object-cover" />
                      English
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAccessibilityOpen(true)}
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-green-500"
                aria-label={t('navbar.accessibility')}
              >
                <IoAccessibilityOutline className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE FLOATING SOCIALS & ACCESSIBILITY ── */}
        <div className="lg:hidden fixed left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[60]">
          <a href="https://t.me/UrDPI_UZ" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 bg-sky-500 hover:opacity-90">
            <BsTelegram className="h-4 w-4" />
          </a>
          <a href="https://www.instagram.com/urspi.uz?igsh=b3Bwc2g0YWoxYnZh" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 bg-red-500 hover:opacity-90">
            <FaInstagram className="h-4 w-4" />
          </a>
          <a href="https://www.facebook.com/people/Urganch-Davlat-Pedagogika-Instituti/pfbid0bPNZR2Wy86C9X3wdZFFYaGfzuShapjc1h92dUG1r324CAopcCRSZrKzXCq4ZnEkEl/?mibextid" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 bg-blue-600 hover:opacity-90">
            <FaFacebookF className="h-4 w-4" />
          </a>
          <a href="https://www.youtube.com/@urspiurspi" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 bg-red-600 hover:opacity-90">
            <TfiYoutube className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setAccessibilityOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 bg-green-500 hover:opacity-90"
            aria-label={t('navbar.accessibility')}
          >
            <IoAccessibilityOutline className="h-5 w-5" />
          </button>
        </div>

        {/* ── 2. LOGO ── */}
        <div
          className="relative px-4 py-5 lg:px-8 lg:py-6"
          style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className={`absolute inset-0 transition-colors duration-500 ${isGreenTheme ? 'bg-[#011a14]/50' : 'bg-[#0c1f4a]/30'}`} />
          <div className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between">
            <a href="#">
              <img src={logoImg} alt="URSPI Logo" className="h-22 w-auto" />
            </a>
          </div>
        </div>
      </header>

      {/* ── 3. MAIN NAV BAR (STICKY AT VERY TOP ON SCROLL) ── */}
      <div className={`sticky top-0 z-50 px-3 py-3 sm:px-4 lg:px-5 transition-colors duration-500 ${isGreenTheme ? 'bg-[#022c22]' : 'bg-[#0c1f4a]'}`}>
        <nav className={`w-full ${glassNavClass}`}>
          {searchOpen ? (
            <div className="flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-4">
              <Search className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                placeholder={t('navbar.search_placeholder')}
                className="min-w-0 flex-1 bg-transparent text-base text-white placeholder-white/70 outline-none lg:text-lg"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:h-11 lg:w-11"
                aria-label={t('navbar.close_search')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-4 py-3 lg:px-5 lg:py-3.5">
              {/* Hamburger button on navbar */}
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:h-11 lg:w-11"
                aria-label={t('navbar.menu')}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop nav links */}
              <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
                {navLinks.map((link) => (
                  <li key={link.labelKey} className="group relative">
                    {link.dropdown ? (
                      <>
                        <button
                          type="button"
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition xl:px-3 xl:text-[13px] ${isGreenTheme ? 'text-emerald-100 hover:bg-emerald-900/40 hover:text-emerald-300' : 'text-white hover:bg-white/10'}`}
                        >
                          <span className="whitespace-nowrap">{t(link.labelKey)}</span>
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform group-hover:rotate-180" />
                        </button>
                        <ul className={`invisible absolute left-0 top-[calc(100%+6px)] z-50 min-w-[200px] rounded-xl border border-white/20 py-1 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 ${isGreenTheme ? 'bg-[#011a14]/95' : 'bg-[#0c1f4a]/90'}`}>
                          {link.dropdown.map((item) => (
                            <li key={item.labelKey} className={item.submenu ? "relative group/submenu" : ""}>
                              {item.submenu ? (
                                <>
                                  <div
                                    className={`flex items-center justify-between px-4 py-2.5 text-left text-[13px] normal-case cursor-pointer transition ${isGreenTheme ? 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-emerald-300' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    <span>{t(item.labelKey)}</span>
                                    <ChevronRight className="h-3.5 w-3.5 opacity-80" />
                                  </div>
                                  <ul className={`invisible absolute left-full top-0 z-50 min-w-[220px] rounded-xl border border-white/20 py-1 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover/submenu:visible group-hover/submenu:opacity-100 ${isGreenTheme ? 'bg-[#011a14]/95' : 'bg-[#0c1f4a]/90'}`}>
                                    {item.submenu.map((subItem) => (
                                      <li key={subItem.labelKey}>
                                        <a
                                          href={subItem.href}
                                          className={`block px-4 py-2.5 text-left text-[13px] normal-case transition ${isGreenTheme ? 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-emerald-300' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
                                        >
                                          {t(subItem.labelKey)}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : (
                                <a
                                  href={item.href}
                                  className={`block px-4 py-2.5 text-left text-[13px] normal-case transition ${isGreenTheme ? 'text-emerald-100/90 hover:bg-emerald-900/40 hover:text-emerald-300' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
                                >
                                  {t(item.labelKey)}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <a
                        href={link.href}
                        className={`block rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition whitespace-nowrap xl:px-3 xl:text-[13px] ${isGreenTheme ? 'text-emerald-100 hover:bg-emerald-900/40 hover:text-emerald-300' : 'text-white hover:bg-white/10'}`}
                      >
                        {t(link.labelKey)}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              {/* Search */}
              <div className="ml-auto flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={openSearch}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:h-11 lg:w-11"
                  aria-label={t('navbar.search_placeholder')}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* ── MOBILE SIDE DRAWER MENU ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[101] w-[300px] max-w-[85vw] flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${isGreenTheme ? 'bg-[#011a14]' : 'bg-[#0c1f4a]'
          } ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
          <h2 className="text-xl font-bold text-white tracking-wide">Menyu</h2>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Links Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-white/20">
          <ul className="flex flex-col gap-1 text-white">
            <li>
              <a
                href="/"
                className="block rounded-xl px-4 py-3 text-base font-semibold transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                Asosiy sahifa
              </a>
            </li>

            {navLinks.map((link, idx) => (
              <li key={link.labelKey}>
                {link.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-semibold transition hover:bg-white/10"
                      onClick={() => setMobileOpenIdx(mobileOpenIdx === idx ? null : idx)}
                    >
                      <span>{t(link.labelKey)}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${mobileOpenIdx === idx ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {mobileOpenIdx === idx && (
                      <ul className="my-1 ml-4 border-l border-white/15 pl-3 flex flex-col gap-1">
                        {link.dropdown.map((item) => (
                          <li key={item.labelKey}>
                            {item.submenu ? (
                              <>
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
                                  onClick={() =>
                                    setMobileSubOpenKey(
                                      mobileSubOpenKey === item.labelKey ? null : item.labelKey
                                    )
                                  }
                                >
                                  <span>{t(item.labelKey)}</span>
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileSubOpenKey === item.labelKey ? 'rotate-180' : ''
                                      }`}
                                  />
                                </button>
                                {mobileSubOpenKey === item.labelKey && (
                                  <ul className="my-1 ml-3 border-l border-white/10 pl-3 flex flex-col gap-1">
                                    {item.submenu.map((subItem) => (
                                      <li key={subItem.labelKey}>
                                        <a
                                          href={subItem.href}
                                          className="block rounded-lg px-3 py-1.5 text-xs text-white/75 transition hover:bg-white/10 hover:text-white"
                                          onClick={() => setMenuOpen(false)}
                                        >
                                          {t(subItem.labelKey)}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </>
                            ) : (
                              <a
                                href={item.href}
                                className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
                                onClick={() => setMenuOpen(false)}
                              >
                                {t(item.labelKey)}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-semibold transition hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── 4. ACCESSIBILITY DRAWER ── */}
      <AccessibilityDrawer
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  )
}

export default Navbar
