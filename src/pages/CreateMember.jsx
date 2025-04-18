import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, X, Timer, Calculator, ArrowLeft, User, Wrench, Users, BookUser, Cog } from 'lucide-react';
import { supabase } from '../supabase';
import './CreateMember.css';

function CreateMember() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [attributes, setAttributes] = useState({});

  // Countries list
  const countries = [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark", "Finland", "France", "Germany", 
    "Hungary", "India", "Italy", "Japan", "Mexico", "Monaco", "Netherlands", "New Zealand", "Norway", "Poland", "Portugal", 
    "Russia", "Spain", "Sweden", "Switzerland", "Thailand", "United Kingdom", "United States", "Venezuela"
  ];

  // Role options
  const roleOptions = [
    {label: 'Driver', description: 'Race the car and execute strategy on track', icon: <User className="role-icon" />},
    {label: 'Engineer', description: 'Design and optimize car performance', icon: <Cog className="role-icon" />},
    {label: 'Mechanic', description: 'Maintain and repair the race car', icon: <Wrench className="role-icon" />},
    {label: 'Strategist', description: 'Plan race strategy and tactics', icon: <Calculator className="role-icon" />},
    {label: 'Team Principal', description: 'Lead the entire team and make key decisions', icon: <Users className="role-icon" />},
    {label: 'Technical Director', description: 'Oversee all technical aspects of the car', icon: <BookUser className="role-icon" />},
    {label: 'Pit Crew', description: 'Execute fast pit stops during races', icon: <Timer className="role-icon" />}
  ];

  const attributeList = ['skill', 'experience', 'fitness', 'teamwork', 'focus', 'strategy', 'technical', 'leadership', 'aggression'];
  
  const attributeDescriptions = {
    skill: "Overall skill level in their specific role",
    experience: "Years of experience and knowledge in F1",
    fitness: "Physical condition and endurance",
    teamwork: "Ability to work effectively with others",
    focus: "Concentration and attention to detail",
    strategy: "Race strategy planning and decision making",
    technical: "Technical knowledge and problem-solving",
    leadership: "Ability to lead and inspire the team",
    aggression: "Racing aggression and overtaking ability",
  };
  
  // Handle attribute change
  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {      
      const { data, error } = await supabase
        .from('team_members')
        .insert([
          { 
            name,
            role,
            nationality,
            age: Number(age),
            bio,
            attributes: attributes
          }
        ])
        .select();
      navigate('/team');
    } catch (error) {
      'Failed to create team member: ' + error
    }
  };

  const renderRoleOptions = () => {
    return (
      <div className="option-buttons">
        {roleOptions.map(roleOption => (
          <button
            key={roleOption.label}
            type="button"
            className={role === roleOption.label ? 'option-btn selected' : 'option-btn'}
            onClick={() => setRole(roleOption.label)}
          >
            <span className="role-icon">{roleOption.icon}</span>
            <span className="role-label">{roleOption.label}</span>
            <span className="role-description">{roleOption.description}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="main-content">
      <Link to="/team" className="btn secondary"><ArrowLeft className='icon'/> Back to Team</Link>
      <form onSubmit={handleSubmit}>

      <div className="header-content">
        <div className="header-text">
          <h2>Add Team Member</h2>
          <p>Create a new member for your F1 team</p>
        </div>
        <div className="header-actions">
        <button
          type="button" className="btn secondary"
          onClick={() => {setName(''); setRole(''); setNationality(''); setAge(''); setBio(''); setAttributes({})}}
        >
          <X className="icon" /> Reset
        </button>

          <button type="submit" className="btn primary"><Save className="icon" /> Save</button>
        </div>
      </div>
                
      <div className="basic-info container">
        <h2>Basic Information</h2>
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lewis Hamilton"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nationality">Nationality</label>
          <select
            id="nationality" value={nationality}
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
            type="number" id="age" min="16" max="80" value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 36"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Biography</label>
          <textarea
            id="bio" rows={4} value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter a brief biography of this team member..."
            required
          />
        </div>
      </div>
        
      {/* Roles section */}
      <div className="roles container">
        <h2>Team Role</h2>
        <div className="form-group">
          {renderRoleOptions()}
        </div>
      </div>
      
      {/* Attributes section */}
      <div className="attributes container">
        <h2>Attributes</h2>
        <div className="attribute-sliders">
          {attributeList.map((attr) => (
            <div key={attr} className="attribute-slider">
              <div className="attribute-label-row">
                <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
                <span className="attribute-value">{attributes[attr]}</span>
              </div>
              <input
                type="range" min="1" max="10"
                value={attributes[attr]}
                onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value))}
              />
              <p className="attribute-description">{attributeDescriptions[attr]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
            <button type="button" className="btn secondary" onClick={() => navigate('/team')}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Create Team Member
            </button>
          </div>
      </form>
    </div>
  );
}

export default CreateMember;