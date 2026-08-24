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
import LeadershipPage from './pages/institute/LeadershipPage'
import FacultiesPage from './pages/institute/FacultiesPage'
import DepartmentsPage from './pages/institute/DepartmentsPage'
import FacultyStaffPage from './pages/institute/FacultyStaffPage'
import DepartmentStaffPage from './pages/institute/DepartmentStaffPage'
import FacultyDetailPage from './pages/institute/FacultyDetailPage'
import CentersPage from './pages/institute/CentersPage'
import CenterStaffPage from './pages/institute/CenterStaffPage'
import EmployeeProfilePage from './pages/institute/EmployeeProfilePage'
import RegulatoryDocumentsPage from './pages/institute/RegulatoryDocumentsPage'
import GreenInstitute from './pages/green-institute/GreenInstitute'
import InfographicPage from './pages/institute/InfographicPage'
import DormitoryPage from './pages/students/DormitoryPage'
import AntiCorruptionPage from './pages/institute/AntiCorruptionPage'
import AiAgent from './components/home/ai-agent/AiAgent'
import ScrollToTop from './components/seasonEffect/ScrollToTop'
import BachelorPage from './pages/admission/BachelorPage'
import MasterPage from './pages/admission/MasterPage'
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
        <Route path="/leadership" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <LeadershipPage />
            <Footer />
          </div>
        } />

        {/* Fakultetlar sahifasi */}
        <Route path="/faculties" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FacultiesPage />
            <Footer />
          </div>
        } />

        {/* Kafedralar sahifasi */}
        <Route path="/departments" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <DepartmentsPage />
            <Footer />
          </div>
        } />

        {/* Fakultet xodimlari sahifasi */}
        <Route path="/faculty-staff" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FacultyStaffPage />
            <Footer />
          </div>
        } />

        {/* Kafedra xodimlari sahifasi */}
        <Route path="/department-staff" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <DepartmentStaffPage />
            <Footer />
          </div>
        } />

        {/* Fakultet haqida sahifasi */}
        <Route path="/faculty-about" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <FacultyDetailPage />
            <Footer />
          </div>
        } />

        {/* Markazlar va bo'limlar sahifasi */}
        <Route path="/centers" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <CentersPage />
            <Footer />
          </div>
        } />

        {/* Markaz xodimlari sahifasi */}
        <Route path="/centers/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <CenterStaffPage />
            <Footer />
          </div>
        } />

        {/* Meyoriy hujjatlar sahifasi */}
        <Route path="/regulatory-documents" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <RegulatoryDocumentsPage />
            <Footer />
          </div>
        } />

        {/* Xodim profili sahifasi */}
        <Route path="/employee/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <EmployeeProfilePage />
            <Footer />
          </div>
        } />
        <Route path="/xodim/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <EmployeeProfilePage />
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
        <Route path="/infographic" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <InfographicPage />
            <Footer />
          </div>
        } />

        {/* Yotoqxona sahifasi */}
        <Route path="/dormitory" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <DormitoryPage />
            <Footer />
          </div>
        } />

        {/* Bakalavriat sahifasi */}
        <Route path="/bachelor" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <BachelorPage />
            <Footer />
          </div>
        } />

        {/* Magistratura sahifasi */}
        <Route path="/master" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <MasterPage />
            <Footer />
          </div>
        } />

        {/* Korrupsiyaga qarshi kurashish sahifasi */}
        <Route path="/anti-corruption" element={<AntiCorruptionPage />} />
      </Routes>
      <AiAgent />
    </Router>
  )
}

export default App
