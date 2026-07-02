import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import AdminLogin from './components/dashboard/AdminLogin'
import Dashboard from './components/dashboard/Dashboard'
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
        
        {/* Admin kirish sahifasi */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Dashboard sahifasi */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
