import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CreateCar from './pages/CreateCar'
import CarDetails from './components/CarDetails'
import EditCar from './components/EditCar'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container mx-auto'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreateCar />} />
          <Route path='/car/:id' element={<CarDetails />} />
          <Route path='/edit/:id' element={<EditCar />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App