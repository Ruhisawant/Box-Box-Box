import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Build Your Championship F1 Team</h1>
        <p>Create, customize and manage your own Formula 1 racing team!</p>
        <div className="hero-buttons">
          <Link to="/create" className="btn btn-primary">Create New Car</Link>
          <Link to="/gallery" className="btn btn-secondary">View Your Team</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Design Custom Cars</h3>
          <p>Configure engine power, aerodynamics, tire compound and more!</p>
        </div>
        <div className="feature">
          <h3>Build Your Dream Team</h3>
          <p>Assemble a diverse fleet of racing cars to dominate every track.</p>
        </div>
        <div className="feature">
          <h3>Track Performance</h3>
          <p>Monitor and optimize your team's strengths and weaknesses.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;