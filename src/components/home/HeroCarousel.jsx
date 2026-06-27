import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'

const slides = [
  {
    id: 1,
    image: slider1,
    title: "Urganch davlat pedagogika instituti tashkil etildi",
    link: "#",
  },
  {
    id: 2,
    image: slider2,
    title: "Zamonaviy ta'lim texnologiyalari va innovatsion yondashuv",
    link: "#",
  }
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Set up autoplay
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(nextSlide, 6000)
  }

  const handleNext = () => {
    nextSlide()
    resetTimer()
  }

  const handlePrev = () => {
    prevSlide()
    resetTimer()
  }

  const handleDotClick = (index) => {
    setCurrent(index)
    resetTimer()
  }

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 group" aria-label="Hero slider">
      {/* Slides Container */}
      <div className="relative h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === current
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transform scale-100 transition-transform duration-[6000ms] ease-out"
                style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Oldingi rasm"
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Keyingi rasm"
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Bottom Glass Overlay (Captions) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[1000px] text-center px-4">
        <div className="rounded-2xl sm:rounded-full border border-white/20 bg-white/20 px-6 py-4 shadow-lg backdrop-blur-md">
          <p className="text-sm sm:text-base md:text-lg font-medium text-white tracking-wide">
            {slides[current].title}
          </p>
          <a
            href={slides[current].link}
            className="inline-block mt-1 text-xs sm:text-sm font-semibold text-[#3b82f6] hover:text-[#60a5fa] hover:underline transition-colors duration-200"
          >
            Batafsil
          </a>
        </div>
      </div>

      {/* Indicators/Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-blue-500' : 'w-2.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
