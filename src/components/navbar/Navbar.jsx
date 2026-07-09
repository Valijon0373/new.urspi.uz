import { MapPin, ChevronDown, Languages, Menu, X, Search } from 'lucide-react'
import { BsTelegram } from 'react-icons/bs'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import { TfiYoutube } from 'react-icons/tfi'
import { IoAccessibilityOutline } from 'react-icons/io5'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
      { labelKey: 'Institut tarixi', href: '#' },
      { labelKey: 'Institut nizomi', href: '#' },
      { labelKey: 'Rahbariyat', href: '/rahbariyat' },
      { labelKey: 'Fakultetlar', href: '/fakultetlar' },
      { labelKey: 'Kafedralar', href: '/kafedralar' },
      { labelKey: 'Markaz va bo‘limlar', href: '/markazlar' },
      { labelKey: 'Me\'yoriy hujjatlar', href: '/meyoriy-hujjatlar' },
    ],
  },
  {
    labelKey: 'navbar.links.activity',
    href: '#',
    dropdown: [
      { labelKey: 'navbar.links.science', href: '#' },
      { labelKey: 'navbar.links.education', href: '#' },
      { labelKey: 'navbar.links.international', href: '#' },
      { labelKey: 'navbar.links.projects', href: '#' },
    ],
  },
  {
    labelKey: 'navbar.links.students',
    href: '#',
    dropdown: [
      { labelKey: 'navbar.links.student_life', href: '#' },
      { labelKey: 'navbar.links.scholarships', href: '#' },
      { labelKey: 'navbar.links.dormitory', href: '#' },
      { labelKey: 'navbar.links.library', href: '#' },
    ],
  },
  { labelKey: 'navbar.links.admission', href: '#', dropdown: null },
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
    href: '#',
    dropdown: [
      { labelKey: 'navbar.links.appeal', href: '#' },
      { labelKey: 'navbar.links.docs', href: '#' },
      { labelKey: 'navbar.links.reports', href: '#' },
    ],
  },
  { labelKey: 'navbar.links.stats', href: '#', dropdown: null },
]


function SocialLink({ href, label, children }) {
  const hoverColor = hoverColors[label] || 'hover:bg-white/20'

  return (
    <a
      href={href}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition ${hoverColor}`}
    >
      {children}
    </a>
  )
}

function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpenIdx, setMobileOpenIdx] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const glassNavClass =
    'rounded-2xl border border-white/20 bg-[#1a2f55]/70 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl'

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
    <header className="relative w-full z-50">
      {/* ── 1. TOP BAR ── */}
      <div className="sticky top-0 z-50 bg-[#0c1f4a] px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <p className="flex items-start gap-1.5 text-left text-[11px] leading-snug text-white sm:items-center sm:text-xs">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
            <span>{t('navbar.address')}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <SocialLink href="#" label="Telegram"><BsTelegram className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="Instagram"><FaInstagram className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="Facebook"><FaFacebookF className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="YouTube"><TfiYoutube className="h-4 w-4" /></SocialLink>

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
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-32 rounded-xl border border-white/20 bg-[#0c1f4a]/90 py-1.5 shadow-xl backdrop-blur-xl">
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
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-green-500"
              aria-label={t('navbar.accessibility')}
            >
              <IoAccessibilityOutline className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. LOGO ── */}
      <div
        className="relative px-4 py-5 lg:px-8 lg:py-6"
        style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0c1f4a]/30" />
        <div className="relative z-10 mx-auto flex max-w-[1400px] justify-start">
          <a href="#">
            <img src={logoImg} alt="URSPI Logo" className="h-22 w-auto" />
          </a>
        </div>
      </div>

      {/* ── 3. MAIN NAV BAR ── */}
      <div className="bg-[#0c1f4a] px-3 py-4 sm:px-4 lg:px-5">
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
            <>
              <div className="flex items-center gap-1.5 px-4 py-3 lg:px-5 lg:py-3.5">
                {/* Hamburger */}
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:h-11 lg:w-11"
                  aria-label={t('navbar.menu')}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X className="h-5 w-5 lg:hidden" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Desktop nav links */}
                <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
                  {navLinks.map((link) => (
                    <li key={link.labelKey} className="group relative">
                      {link.dropdown ? (
                        <>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 xl:px-3 xl:text-[13px]"
                          >
                            <span className="whitespace-nowrap">{t(link.labelKey)}</span>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform group-hover:rotate-180" />
                          </button>
                          <ul className="invisible absolute left-0 top-[calc(100%+6px)] z-50 min-w-[200px] rounded-xl border border-white/20 bg-[#0c1f4a]/90 py-1 opacity-0 shadow-xl backdrop-blur-xl transition-all group-hover:visible group-hover:opacity-100">
                            {link.dropdown.map((item) => (
                              <li key={item.labelKey}>
                                <a
                                  href={item.href}
                                  className="block px-4 py-2.5 text-left text-[13px] normal-case text-white/85 transition hover:bg-white/10 hover:text-white"
                                >
                                  {t(item.labelKey)}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <a
                          href={link.href}
                          className="block rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 xl:px-3 xl:text-[13px] whitespace-nowrap"
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

              {/* Mobile menu */}
              {menuOpen && (
                <div className="border-t border-white/15 px-4 py-3 lg:hidden">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link, idx) => (
                      <li key={link.labelKey}>
                        {link.dropdown ? (
                          <>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                              onClick={() => setMobileOpenIdx(mobileOpenIdx === idx ? null : idx)}
                            >
                              {t(link.labelKey)}
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${mobileOpenIdx === idx ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {mobileOpenIdx === idx && (
                              <ul className="mb-1 ml-2 border-l border-white/15 pl-3">
                                {link.dropdown.map((item) => (
                                  <li key={item.labelKey}>
                                    <a
                                      href={item.href}
                                      className="block rounded-lg px-2 py-2 text-sm normal-case text-white/80 transition hover:bg-white/10 hover:text-white"
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {t(item.labelKey)}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <a
                            href={link.href}
                            className="block rounded-lg px-2 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                            onClick={() => setMenuOpen(false)}
                          >
                            {t(link.labelKey)}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </nav>
      </div>

      {/* ── 4. ACCESSIBILITY DRAWER ── */}
      <AccessibilityDrawer
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </header>
  )
}

export default Navbar
