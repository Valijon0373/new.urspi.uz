import HeroCarousel from './HeroCarousel'
import News from './news/News'
import Announcement from './announcement/Announcement'
import Statistics from './statistics/Statistics'
import Esystems from './e-systems/Esystems'
import Galery from './galery/Galery'
import Links from './links/Links'


export default function Home() {
  return (
    <div className="w-full relative">
      <HeroCarousel />
      <News />
      <Announcement />
      <Statistics />
      <Esystems />
      <Links />
      <Galery />

    </div>
  )
}
