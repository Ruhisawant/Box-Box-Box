import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './CreateMember.css';

function CreateMember() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attributes, setAttributes] = useState({
    skill: 5,
    experience: 5,
    fitness: 5,
    teamwork: 5,
    focus: 5,
    aggression: 5,
    technical: 5,
    leadership: 5,
    strategy: 5
  });

  // Role options
  const roleOptions = ['Driver', 'Engineer', 'Mechanic', 'Strategist', 'Team Principal', 'Technical Director'];
  
  // Countries list
  const countries = [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark",
    "Finland", "France", "Germany", "Hungary", "India", "Italy", "Japan", "Mexico",
    "Monaco", "Netherlands", "New Zealand", "Norway", "Poland", "Portugal", "Russia", "Spain",
    "Sweden", "Switzerland", "Thailand", "United Kingdom", "United States", "Venezuela"
  ];

  // Handle attribute change
  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !role || !nationality || !age || !bio) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (isNaN(Number(age)) || Number(age) < 16 || Number(age) > 80) {
      setError('Age must be a number between 16 and 80');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Filter attributes based on role
      const filteredAttributes = {
        skill: attributes.skill,
        experience: attributes.experience,
        fitness: attributes.fitness,
        teamwork: attributes.teamwork,
        focus: attributes.focus
      };

      // Add role-specific attributes
      if (role === 'Driver') {
        filteredAttributes.aggression = attributes.aggression;
      }
      if (role === 'Engineer' || role === 'Mechanic' || role === 'Technical Director') {
        filteredAttributes.technical = attributes.technical;
      }
      if (role === 'Strategist') {
        filteredAttributes.strategy = attributes.strategy;
      }
      if (role === 'Team Principal' || role === 'Technical Director') {
        filteredAttributes.leadership = attributes.leadership;
      }
      
      // Create new team member in Supabase
      const { data, error } = await supabase
        .from('team_members')
        .insert([
          { 
            name,
            role,
            nationality,
            age: Number(age),
            bio,
            attributes: filteredAttributes
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Navigate to the team page to see all team members
      navigate('/team');
      
    } catch (error) {
      setError('Failed to create team member: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOptions = (options, currentValue, setter) => {
    return (
      <div className="option-buttons">
        {options.map(option => (
          <button
            key={option}
            type="button"
            className={currentValue === option ? 'option-btn selected' : 'option-btn'}
            onClick={() => setter(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="create-team-member-container">
      <div className="create-header">
        <h1>Add Team Member</h1>
        <Link to="/team" className="team-link">View Team</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="team-member-layout">
        <form onSubmit={handleSubmit} className="team-member-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lewis Hamilton"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            {renderOptions(roleOptions, role, setRole)}
          </div>
          
          <div className="form-group">
            <label htmlFor="nationality">Nationality</label>
            <select
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            >
              <option value="" disabled>Select nationality</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              min="16"
              max="80"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 36"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Biography</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter a brief biography of this team member..."
              rows={4}
              required
            />
          </div>

          <div className="form-group attributes-section">
            <h3>Attributes</h3>
            
            <div className="attribute-sliders">
              <div className="attribute-slider">
                <label>Skill</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={attributes.skill}
                  onChange={(e) => handleAttributeChange('skill', parseInt(e.target.value))}
                />
                <span className="attribute-value">{attributes.skill}</span>
              </div>
              
              <div className="attribute-slider">
                <label>Experience</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={attributes.experience}
                  onChange={(e) => handleAttributeChange('experience', parseInt(e.target.value))}
                />
                <span className="attribute-value">{attributes.experience}</span>
              </div>
              
              <div className="attribute-slider">
                <label>Fitness</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={attributes.fitness}
                  onChange={(e) => handleAttributeChange('fitness', parseInt(e.target.value))}
                />
                <span className="attribute-value">{attributes.fitness}</span>
              </div>
              
              <div className="attribute-slider">
                <label>Teamwork</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={attributes.teamwork}
                  onChange={(e) => handleAttributeChange('teamwork', parseInt(e.target.value))}
                />
                <span className="attribute-value">{attributes.teamwork}</span>
              </div>
              
              <div className="attribute-slider">
                <label>Focus</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={attributes.focus}
                  onChange={(e) => handleAttributeChange('focus', parseInt(e.target.value))}
                />
                <span className="attribute-value">{attributes.focus}</span>
              </div>
              
              {/* Role-specific attributes */}
              {role === 'Driver' && (
                <div className="attribute-slider">
                  <label>Aggression</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={attributes.aggression}
                    onChange={(e) => handleAttributeChange('aggression', parseInt(e.target.value))}
                  />
                  <span className="attribute-value">{attributes.aggression}</span>
                </div>
              )}
              
              {(role === 'Engineer' || role === 'Mechanic' || role === 'Technical Director') && (
                <div className="attribute-slider">
                  <label>Technical</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={attributes.technical}
                    onChange={(e) => handleAttributeChange('technical', parseInt(e.target.value))}
                  />
                  <span className="attribute-value">{attributes.technical}</span>
                </div>
              )}
              
              {(role === 'Team Principal' || role === 'Technical Director') && (
                <div className="attribute-slider">
                  <label>Leadership</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={attributes.leadership}
                    onChange={(e) => handleAttributeChange('leadership', parseInt(e.target.value))}
                  />
                  <span className="attribute-value">{attributes.leadership}</span>
                </div>
              )}
              
              {role === 'Strategist' && (
                <div className="attribute-slider">
                  <label>Strategy</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={attributes.strategy}
                    onChange={(e) => handleAttributeChange('strategy', parseInt(e.target.value))}
                  />
                  <span className="attribute-value">{attributes.strategy}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={() => navigate('/team')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Team Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMember;