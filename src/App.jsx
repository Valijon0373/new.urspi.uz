import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Home />
    </div>
  )
}

export default App
