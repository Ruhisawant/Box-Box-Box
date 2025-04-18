import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MemberForm from './pages/MemberForm'
import TeamGallery from './pages/TeamGallery'
import MemberDetails from './components/MemberDetails'
import TeamPerformance from './pages/TeamPerformance'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />    
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<MemberForm />} />
        <Route path='/edit-member/:id' element={<MemberForm />} />
        <Route path='/gallery' element={<TeamGallery />} />
        <Route path='/member-details/:id' element={<MemberDetails />} />
        <Route path='/performance' element={<TeamPerformance />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App