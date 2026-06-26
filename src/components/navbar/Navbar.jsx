import { MapPin, ChevronDown, Languages } from 'lucide-react'
import { BsTelegram } from 'react-icons/bs'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import { TfiYoutube } from 'react-icons/tfi'

const address =
  "Manzil: O'zbekiston, 220100, Urganch shahri, Gurlan ko'chasi, 1-A uy"

const hoverColors = {
  Telegram: 'hover:bg-sky-500',
  Facebook: 'hover:bg-blue-600',
  Instagram: 'hover:bg-red-500',
  YouTube: 'hover:bg-red-600',
}

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
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#0c1f4a] px-4 py-4 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <p className="flex items-start gap-1.5 text-left text-[11px] leading-snug text-white sm:items-center sm:text-xs">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
            <span>{address}</span>
          </p>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <SocialLink href="#" label="Telegram">
              <BsTelegram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="#" label="Instagram">
              <FaInstagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="#" label="Facebook">
              <FaFacebookF className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="#" label="YouTube">
              <TfiYoutube className="h-4 w-4" />
            </SocialLink>
            <button
              type="button"
              className="flex h-9 items-center gap-0.5 rounded-lg bg-white/10 px-2 text-white transition hover:bg-white/20"
              aria-label="Til tanlash"
            >
              <Languages className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
