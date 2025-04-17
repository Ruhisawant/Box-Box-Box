import { Link } from 'react-router-dom';
import { UsersRound, Plus, CircleAlert, Trophy, ArrowRight } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="body">
      <div className="header-content">
        <h1>Build Your <span>Ultimate</span> F1 Team</h1>
        <p>Assemble the perfect Formula 1 team by customizing drivers, engineers, mechanics, and more. Optimize your team's performance to dominate the racing world.</p>
      
        <div className="buttons">
          <Link to="/create" className="btn primary"><Plus className="icon" /> Add Team Member</Link>
          <Link to="/gallery" className="btn secondary"><UsersRound className="icon" /> View Team</Link>
        </div>
      </div>

      <div className='performance-section'>
        {/* to be made */}
        <div className="container">Team Performance</div>
      </div>

      <div className="members-section">
        <div className="title">
          <h2>Recent Team Members</h2>
          <Link to="/gallery" className="view-link"><ArrowRight className="icon" /> View All</Link>
        </div>
        <div className="container">
          <CircleAlert /> No team members yet
          <Link to="/create" className="btn primary"><Plus className="icon" /> Add Your First Team Member</Link>
        </div>
        {/* to be made */}
      </div>

      <div className="features-section">
        <div className="container card">
          <div className="icon red"><UsersRound /></div>
          <h3>Create Your Crew</h3>
          <p>Add drivers, engineers, mechanics, and more with customizable skills and attributes.</p>
        </div>
        <div className="container card">
        <div className="icon blue"><Trophy /></div>
          <h3>Track Performance</h3>
          <p>Monitor your team's overall performance metrics and identify areas for improvement.</p>
        </div>
        <div className="container card">
        <div className="icon yellow"><ArrowRight /></div>
          <h3>Optimize Strategy</h3>
          <p>Build a balanced team with complementary skills to maximize your chances of success.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;