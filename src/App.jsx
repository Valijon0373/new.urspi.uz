import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import AdminLogin from './components/dashboard/AdminLogin'
import Dashboard from './components/dashboard/Dashboard'
import AnnouncementsPage from './pages/AnnouncementsPage'
import AnnouncementDetailPage from './pages/AnnouncementDetailPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import RahbariyatPage from './pages/RahbariyatPage'
import './App.css'

function App() {
  return (
    <Router>
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

        {/* Admin kirish sahifasi */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Dashboard sahifasi */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
