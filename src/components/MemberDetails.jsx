import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { supabase } from '../supabase';
import './MemberDetails.css';

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        if (!data) {
          throw new Error('Team member not found');
        }
        
        setMember(data);
      } catch (error) {
        'Error fetching team member details:', error.message
      }
    };
    
    fetchMemberDetails();
  }, [id]);

  // Helper function to calculate overall rating
  const calculateRating = (member) => {
    if (!member || !member.attributes) return { total: 0 };
    const attributes = member.attributes || {};
    
    const attributeValues = Object.values(attributes).filter(val => 
      typeof val === 'number' && !isNaN(val)
    );
    
    if (attributeValues.length === 0) return { total: 0, ...attributes };
    
    // Calculate average
    const total = Math.round(
      attributeValues.reduce((sum, value) => sum + value, 0) / attributeValues.length
    );
    
    return {
      total,
      ...attributes
    };
  };

  // Helper to get role-specific strengths
  const getRoleStrengths = (member) => {
    if (!member || !member.attributes) return 'Unknown';
    
    const strengths = [];
    const attributes = member.attributes || {};
    
    // Common attributes assessment
    if (attributes.skill >= 8) strengths.push('High Skill Level');
    if (attributes.experience >= 8) strengths.push('Highly Experienced');
    if (attributes.teamwork >= 8) strengths.push('Excellent Team Player');
    if (attributes.focus >= 8) strengths.push('Strong Focus');
    if (attributes.fitness >= 8) strengths.push('Exceptional Fitness');
    if (attributes.aggression >= 8) strengths.push('Highly Aggressive');
    if (attributes.technical >= 8) strengths.push('Technical Expert');
    if (attributes.leadership >= 8) strengths.push('Strong Leader');
    if (attributes.strategy >= 8) strengths.push('Strategic Mastermind');
    
    return strengths.length > 0 ? strengths.join(', ') : 'No specific strengths';
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      navigate('/gallery');
    } catch (error) {
      'Error deleting team member:', error.message
    }
  };

  if (!member) {
    return (
      <div className="error-container">
        <div className="error-message">Team member not found</div>
        <Link to="/gallery" className="back-link">Back to Team</Link>
      </div>
    );
  }

  const rating = calculateRating(member);
  
  // Define all 9 attributes with their colors
  const allAttributes = [
    { key: 'skill', label: 'Skill', color: '#8b4513' },        // Red
    { key: 'experience', label: 'Experience', color: '#0090ff' }, // Blue
    { key: 'fitness', label: 'Fitness', color: '#ffcc00' },    // Yellow
    { key: 'teamwork', label: 'Teamwork', color: '#44cc00' },  // Green
    { key: 'focus', label: 'Focus', color: '#9900cc' },        // Purple
    { key: 'aggression', label: 'Aggression', color: '#ff6600' }, // Orange
    { key: 'technical', label: 'Technical', color: '#00ccaa' }, // Teal
    { key: 'leadership', label: 'Leadership', color: '#ff3399' }, // Pink
    { key: 'strategy', label: 'Strategy', color: '#ff1801' }   // Brown
  ];

  return (
    <div className="details-main-content">
      <div className="details-header-content">
        <Link to="/gallery" className="btn secondary"><ArrowLeft className='icon'/>Back to Gallery</Link>
        <div className="details-actions">
          <Link to={`/edit-member/${member.id}`} className="btn secondary"><Pencil className='icon'/></Link>
          <button onClick={handleDelete} className="btn primary"><Trash2 className='icon'/></button>
        </div>
      </div>
      
      <div className="title container">
        <div className="left">
          <h2>{member.name}</h2>
          <div className={'member-role'}>
            {member.role}
          </div>
        </div>
        <div className="right rating-avg">
          Overall Rating: <span className="highlight">{rating.total}/10</span>
        </div>
      </div>

      <div className="container">
        <div className="member-info-content">
          <h3>Personal Information</h3>
          <div className="info-section">
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value">{member.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nationality</span>
              <span className="info-value">{member.nationality}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">{member.age}</span>
            </div>
          </div>

          <div className="biography-section">
            <h3>Biography</h3>
            <p>{member.bio}</p>
          </div>

          <div className="details-attributes-section">
            <h3>Performance Analysis</h3>            
            <div className="details-attribute-bars">
              {allAttributes.map(attr => {
                const value = member.attributes && member.attributes[attr.key] !== undefined 
                  ? member.attributes[attr.key] 
                  : 0;
                
                return (
                  <div className="details-attribute-bar" key={attr.key}>
                    <div className="bar-label">{attr.label}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${value * 10}%`, backgroundColor: attr.color }}
                      ></div>
                    </div>
                    <div className="bar-value">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        
          <div className="strengths-section">
            <h3>Key Strengths</h3>
            <p>{getRoleStrengths(member)}</p>
          </div>
          
          <div className="role-notes">
            <h3>Role Assessment</h3>
            <p>
              {member.role === 'Driver' && 'This team member is responsible for piloting the F1 car during races and qualifying sessions.'}
              {member.role === 'Engineer' && 'This team member is responsible for designing and optimizing the car\'s performance.'}
              {member.role === 'Mechanic' && 'This team member is responsible for maintaining and repairing the car.'}
              {member.role === 'Strategist' && 'This team member is responsible for race strategy and tactical decisions.'}
              {member.role === 'Team Principal' && 'This team member leads the entire F1 team and makes key decisions.'}
              {member.role === 'Technical Director' && 'This team member oversees all technical aspects of the car development.'}
            </p>
            <p>
              {rating.total >= 9 && 'An exceptional team member who performs at the highest level.'}
              {rating.total >= 7 && rating.total < 9 && 'A very strong team member who consistently delivers good results.'}
              {rating.total >= 5 && rating.total < 7 && 'A solid team member who meets expectations.'}
              {rating.total < 5 && 'A team member who has areas for improvement.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;