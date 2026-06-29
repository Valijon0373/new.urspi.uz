import HeroCarousel from './HeroCarousel'
import News from './news/News'
import Announcement from './announcement/Announcement'
import Statistics from './statistics/Statistics'

export default function Home() {
  return (
    <div className="w-full">
      <HeroCarousel />
      <News />
      <Announcement />
      <Statistics />
    </div>
  )
}
