import { MapPin, ChevronDown, Languages, Menu, X, Search } from 'lucide-react'
import { BsTelegram } from 'react-icons/bs'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import { TfiYoutube } from 'react-icons/tfi'
import { IoAccessibilityOutline } from 'react-icons/io5'
import { useState, useRef, useEffect } from 'react'
import logoImg from '../../assets/images/logo.png'
import bgImg from '../../assets/images/background.jpg'

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
    label: 'INSTITUT',
    href: '#',
    dropdown: [
      { label: 'Institut haqida', href: '#' },
      { label: 'Rektor', href: '#' },
      { label: 'Tuzilma', href: '#' },
      { label: 'Fakultetlar', href: '#' },
      { label: 'Kafedralar', href: '#' },
    ],
  },
  {
    label: 'FAOLIYAT',
    href: '#',
    dropdown: [
      { label: 'Ilmiy faoliyat', href: '#' },
      { label: "Ta'lim faoliyati", href: '#' },
      { label: 'Xalqaro hamkorlik', href: '#' },
      { label: 'Loyihalar', href: '#' },
    ],
  },
  {
    label: 'TALABALARGA',
    href: '#',
    dropdown: [
      { label: 'Talabalar hayoti', href: '#' },
      { label: 'Stipendiyalar', href: '#' },
      { label: 'Yotoqxona', href: '#' },
      { label: 'Kutubxona', href: '#' },
    ],
  },
  { label: 'QABUL 2026', href: '#', dropdown: null },
  { label: 'YASHIL UNIVERSITET', href: '#', dropdown: null },
  {
    label: 'XORIJIY TALABALAR',
    href: '#',
    dropdown: [
      { label: 'Xorijiy talabalar uchun', href: '#' },
      { label: 'Til kurslari', href: '#' },
      { label: 'Viza va hujjatlar', href: '#' },
    ],
  },
  {
    label: 'KORRUPSIYAGA QARSHI KURASHISH',
    href: '#',
    dropdown: [
      { label: 'Murojaat qilish', href: '#' },
      { label: "Me'yoriy hujjatlar", href: '#' },
      { label: 'Hisobotlar', href: '#' },
    ],
  },
  { label: 'STATISTIKA', href: '#', dropdown: null },
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpenIdx, setMobileOpenIdx] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
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

  return (
    <header className="w-full">
      {/* ── 1. TOP BAR ── */}
      <div className="sticky top-0 z-50 bg-[#0c1f4a] px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <p className="flex items-start gap-1.5 text-left text-[11px] leading-snug text-white sm:items-center sm:text-xs">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
            <span>{address}</span>
          </p>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <SocialLink href="#" label="Telegram"><BsTelegram className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="Instagram"><FaInstagram className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="Facebook"><FaFacebookF className="h-4 w-4" /></SocialLink>
            <SocialLink href="#" label="YouTube"><TfiYoutube className="h-4 w-4" /></SocialLink>
            <button type="button" className="flex h-9 items-center gap-0.5 rounded-lg bg-white/10 px-2 text-white transition hover:bg-white/20" aria-label="Til tanlash">
              <Languages className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20" aria-label="Maxsus imkoniyatlar">
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
                placeholder="Izlash"
                className="min-w-0 flex-1 bg-transparent text-base text-white placeholder-white/70 outline-none lg:text-lg"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:h-11 lg:w-11"
                aria-label="Qidirishni yopish"
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
                  aria-label="Menyu"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X className="h-5 w-5 lg:hidden" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Desktop nav links */}
                <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
                  {navLinks.map((link) => (
                    <li key={link.label} className="group relative">
                      {link.dropdown ? (
                        <>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-lg px-2.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 xl:px-3 xl:text-[13px]"
                          >
                            <span className="whitespace-nowrap">{link.label}</span>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform group-hover:rotate-180" />
                          </button>
                          <ul className="invisible absolute left-0 top-[calc(100%+6px)] z-50 min-w-[200px] rounded-xl border border-white/20 bg-[#0c1f4a]/90 py-1 opacity-0 shadow-xl backdrop-blur-xl transition-all group-hover:visible group-hover:opacity-100">
                            {link.dropdown.map((item) => (
                              <li key={item.label}>
                                <a
                                  href={item.href}
                                  className="block px-4 py-2.5 text-left text-[13px] normal-case text-white/85 transition hover:bg-white/10 hover:text-white"
                                >
                                  {item.label}
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
                          {link.label}
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
                    aria-label="Qidirish"
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
                      <li key={link.label}>
                        {link.dropdown ? (
                          <>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                              onClick={() => setMobileOpenIdx(mobileOpenIdx === idx ? null : idx)}
                            >
                              {link.label}
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${mobileOpenIdx === idx ? 'rotate-180' : ''}`}
                              />
                            </button>
                            {mobileOpenIdx === idx && (
                              <ul className="mb-1 ml-2 border-l border-white/15 pl-3">
                                {link.dropdown.map((item) => (
                                  <li key={item.label}>
                                    <a
                                      href={item.href}
                                      className="block rounded-lg px-2 py-2 text-sm normal-case text-white/80 transition hover:bg-white/10 hover:text-white"
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {item.label}
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
                            {link.label}
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
    </header>
  )
}

export default Navbar
