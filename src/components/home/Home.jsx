import HeroCarousel from './HeroCarousel'
import News from './news/News'
import Announcement from './announcement/Announcement'
import Centers from './centers/Centers'
import Statistics from './statistics/Statistics'
import Esystems from './e-systems/Esystems'
import Gallery from './gallery/Gallery'
import Links from './links/Links'


export default function Home() {
  return (
    <div className="w-full relative">
      <HeroCarousel />
      <News />
      <Announcement />
      <Centers />
      <Statistics />
      <Esystems />
      <Links />
      <Gallery />

    </div>
  )
}
