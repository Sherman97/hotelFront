import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import AccommodationManager from './components/AccommodationManager';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:hotelId" element={<AccommodationManager />} />
    </Routes>
  </Router>
  )
}

export default App
