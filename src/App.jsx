import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateMember from './pages/CreateMember';
import MemberGallery from './pages/MemberGallery';
import MemberDetails from './components/MemberDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>F1 Team Manager</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMember />} />
            <Route path="/gallery" element={<MemberGallery />} />
            <Route path="/car/:id" element={<MemberDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;