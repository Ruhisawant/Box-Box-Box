import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CreateMember from './pages/CreateMember';
import TeamGallery from './pages/TeamGallery';
import MemberDetails from './components/MemberDetails';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMember />} />
        <Route path="/gallery" element={<TeamGallery />} />
        <Route path="/car/:id" element={<MemberDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;