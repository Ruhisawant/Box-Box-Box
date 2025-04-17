import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import CreateMember from './pages/CreateMember';
import MemberGallery from './pages/MemberGallery';
import MemberDetails from './components/MemberDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMember />} />
        <Route path="/gallery" element={<MemberGallery />} />
        <Route path="/car/:id" element={<MemberDetails />} />
      </Routes>
    </Router>
  );
}

export default App;