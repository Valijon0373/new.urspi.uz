import HeroCarousel from './HeroCarousel'
import News from './news/News'
import Announcement from './announcement/Announcement'
import Statistics from './statistics/Statistics'
import Esystems from './e-systems/Esystems'

export default function Home() {
  return (
    <div className="w-full">
      <HeroCarousel />
      <News />
      <Announcement />
      <Statistics />
      <Esystems />
    </div>
  )
}
