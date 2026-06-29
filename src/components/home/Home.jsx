import HeroCarousel from './HeroCarousel'
import News from './news/News'
import Announcement from './announcement/Announcement'

export default function Home() {
  return (
    <div className="w-full">
      <HeroCarousel />
      <News />
      <Announcement />
    </div>
  )
}
