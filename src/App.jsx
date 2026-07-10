import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import AdminLogin from './components/dashboard/AdminLogin'
import Dashboard from './components/dashboard/Dashboard'
import AnnouncementsPage from './pages/institute/AnnouncementsPage'
import AnnouncementDetailPage from './pages/institute/AnnouncementDetailPage'
import NewsPage from './pages/institute/NewsPage'
import NewsDetailPage from './pages/institute/NewsDetailPage'
import RahbariyatPage from './pages/institute/RahbariyatPage'
import FakultetlarPage from './pages/institute/FakultetlarPage'
import KafedralarPage from './pages/institute/KafedralarPage'
import FakultetXodimlariPage from './pages/institute/FakultetXodimlariPage'
import KafedraXodimlariPage from './pages/institute/KafedraXodimlariPage'
import FakultetDetailPage from './pages/institute/FakultetDetailPage'
import MarkazlarPage from './pages/institute/MarkazlarPage'
import MarkazXodimlariPage from './pages/institute/MarkazXodimlariPage'
import XodimProfilePage from './pages/institute/XodimProfilePage'
import MeyoriyHujjatlarPage from './pages/institute/MeyoriyHujjatlarPage'
import GreenInstitute from './pages/green-institute/GreenInstitute'
import InfographicPage from './pages/institute/InfographicPage'
import DormitoryPage from './pages/students/DormitoryPage'
import AiAgent from './components/home/ai-agent/AiAgent'
import ScrollToTop from './components/seasonEffect/ScrollToTop'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Asosiy sahifa */}
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Home />
            <Footer />
          </div>
        } />
        
        {/* E'lonlar sahifasi */}
        <Route path="/announcements" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <AnnouncementsPage />
            <Footer />
          </div>
        } />

        {/* E'lonlar batafsil sahifasi */}
        <Route path="/announcements/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <AnnouncementDetailPage />
            <Footer />
          </div>
        } />

        {/* Yangiliklar sahifasi */}
        <Route path="/news" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <NewsPage />
            <Footer />
          </div>
        } />

        {/* Yangiliklar batafsil sahifasi */}
        <Route path="/news/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <NewsDetailPage />
            <Footer />
          </div>
        } />

        {/* Rahbariyat sahifasi */}
        <Route path="/rahbariyat" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <RahbariyatPage />
            <Footer />
          </div>
        } />

        {/* Fakultetlar sahifasi */}
        <Route path="/fakultetlar" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FakultetlarPage />
            <Footer />
          </div>
        } />

        {/* Kafedralar sahifasi */}
        <Route path="/kafedralar" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <KafedralarPage />
            <Footer />
          </div>
        } />

        {/* Fakultet xodimlari sahifasi */}
        <Route path="/fakultet-xodimlari" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FakultetXodimlariPage />
            <Footer />
          </div>
        } />

        {/* Kafedra xodimlari sahifasi */}
        <Route path="/kafedra-xodimlari" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <KafedraXodimlariPage />
            <Footer />
          </div>
        } />

        {/* Fakultet haqida sahifasi */}
        <Route path="/fakultet-haqida" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FakultetDetailPage />
            <Footer />
          </div>
        } />

        {/* Markazlar va bo'limlar sahifasi */}
        <Route path="/markazlar" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <MarkazlarPage />
            <Footer />
          </div>
        } />

        {/* Markaz xodimlari sahifasi */}
        <Route path="/markazlar/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <MarkazXodimlariPage />
            <Footer />
          </div>
        } />

        {/* Meyoriy hujjatlar sahifasi */}
        <Route path="/meyoriy-hujjatlar" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <MeyoriyHujjatlarPage />
            <Footer />
          </div>
        } />

        {/* Xodim profili sahifasi */}
        <Route path="/xodim/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <XodimProfilePage />
            <Footer />
          </div>
        } />

        {/* Admin kirish sahifasi */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Dashboard sahifasi */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Yashil Universitet sahifasi */}
        <Route path="/green-institute" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <GreenInstitute />
            <Footer />
          </div>
        } />

        {/* Infografika sahifasi */}
        <Route path="/infografika" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <InfographicPage />
            <Footer />
          </div>
        } />

        {/* Yotoqxona sahifasi */}
        <Route path="/yotoqxona" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <DormitoryPage />
            <Footer />
          </div>
        } />
      </Routes>
      <AiAgent />
    </Router>
  )
}

export default App
