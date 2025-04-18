import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './MemberDetails.css';

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError('Error fetching team member details: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberDetails();
  }, [id]);

  // Helper function to calculate overall rating
  const calculateRating = (member) => {
    if (!member || !member.attributes) return { total: 0 };
    
    // Get all attribute values
    const attributeValues = Object.values(member.attributes);
    
    // Calculate average
    const total = Math.round(
      attributeValues.reduce((sum, value) => sum + value, 0) / attributeValues.length
    );
    
    return {
      total,
      ...member.attributes
    };
  };

  // Helper to get role-specific strengths
  const getRoleStrengths = (member) => {
    if (!member) return 'Unknown';
    
    const strengths = [];
    
    // Common attributes assessment
    if (member.attributes.skill >= 8) strengths.push('High Skill Level');
    if (member.attributes.experience >= 8) strengths.push('Highly Experienced');
    if (member.attributes.teamwork >= 8) strengths.push('Excellent Team Player');
    if (member.attributes.focus >= 8) strengths.push('Strong Focus');
    if (member.attributes.fitness >= 8) strengths.push('Exceptional Fitness');
    
    // Role-specific assessments
    if (member.role === 'Driver' && member.attributes.aggression >= 8) {
      strengths.push('Aggressive Driver');
    }
    
    if ((member.role === 'Engineer' || member.role === 'Mechanic' || member.role === 'Technical Director') && 
        member.attributes.technical >= 8) {
      strengths.push('Technical Expert');
    }
    
    if (member.role === 'Strategist' && member.attributes.strategy >= 8) {
      strengths.push('Strategic Mastermind');
    }
    
    if ((member.role === 'Team Principal' || member.role === 'Technical Director') && 
        member.attributes.leadership >= 8) {
      strengths.push('Strong Leader');
    }
    
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
      setError('Error deleting team member: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading team member details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/gallery" className="back-link">Back to Team</Link>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="error-container">
        <div className="error-message">Team member not found</div>
        <Link to="/gallery" className="back-link">Back to Team</Link>
      </div>
    );
  }

  const rating = calculateRating(member);

  return (
    <div className="member-details-container">
      <div className="member-details-navigation">
        <Link to="/gallery" className="back-link">← Back to Team</Link>
        <div className="member-actions">
          <Link to={`/edit-member/${member.id}`} className="edit-link">Edit Member</Link>
          <button onClick={handleDelete} className="delete-btn">Delete Member</button>
        </div>
      </div>
      
      <div className="member-details-header">
        <h2>{member.name}</h2>
        <div className="member-role">{member.role}</div>
      </div>
      
      <div className="member-details-content">
        <div className="member-info-container">
          <h3>Personal Information</h3>
          <div className="info-grid">
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
            <div className="info-item">
              <span className="info-label">Member ID</span>
              <span className="info-value">{member.id}</span>
            </div>
          </div>

          <div className="biography-section">
            <h3>Biography</h3>
            <p>{member.bio}</p>
          </div>

          <div className="attributes-section">
            <h3>Performance Analysis</h3>
            <div className="performance-total">
              Overall Rating: <span className="highlight">{rating.total}/10</span>
            </div>
            
            <div className="attribute-bars">
              {/* Common attributes for all roles */}
              <div className="attribute-bar">
                <div className="bar-label">Skill</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${rating.skill * 10}%`, backgroundColor: '#ff1801' }}
                  ></div>
                </div>
                <div className="bar-value">{rating.skill}</div>
              </div>
              
              <div className="attribute-bar">
                <div className="bar-label">Experience</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${rating.experience * 10}%`, backgroundColor: '#0090ff' }}
                  ></div>
                </div>
                <div className="bar-value">{rating.experience}</div>
              </div>
              
              <div className="attribute-bar">
                <div className="bar-label">Fitness</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${rating.fitness * 10}%`, backgroundColor: '#ffcc00' }}
                  ></div>
                </div>
                <div className="bar-value">{rating.fitness}</div>
              </div>
              
              <div className="attribute-bar">
                <div className="bar-label">Teamwork</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${rating.teamwork * 10}%`, backgroundColor: '#44cc00' }}
                  ></div>
                </div>
                <div className="bar-value">{rating.teamwork}</div>
              </div>
              
              <div className="attribute-bar">
                <div className="bar-label">Focus</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${rating.focus * 10}%`, backgroundColor: '#9900cc' }}
                  ></div>
                </div>
                <div className="bar-value">{rating.focus}</div>
              </div>
              
              {/* Role-specific attributes */}
              {member.role === 'Driver' && rating.aggression && (
                <div className="attribute-bar">
                  <div className="bar-label">Aggression</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${rating.aggression * 10}%`, backgroundColor: '#ff6600' }}
                    ></div>
                  </div>
                  <div className="bar-value">{rating.aggression}</div>
                </div>
              )}
              
              {(member.role === 'Engineer' || member.role === 'Mechanic' || member.role === 'Technical Director') && 
                rating.technical && (
                <div className="attribute-bar">
                  <div className="bar-label">Technical</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${rating.technical * 10}%`, backgroundColor: '#33bbff' }}
                    ></div>
                  </div>
                  <div className="bar-value">{rating.technical}</div>
                </div>
              )}
              
              {(member.role === 'Team Principal' || member.role === 'Technical Director') && 
                rating.leadership && (
                <div className="attribute-bar">
                  <div className="bar-label">Leadership</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${rating.leadership * 10}%`, backgroundColor: '#ff3399' }}
                    ></div>
                  </div>
                  <div className="bar-value">{rating.leadership}</div>
                </div>
              )}
              
              {member.role === 'Strategist' && rating.strategy && (
                <div className="attribute-bar">
                  <div className="bar-label">Strategy</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${rating.strategy * 10}%`, backgroundColor: '#66ccff' }}
                    ></div>
                  </div>
                  <div className="bar-value">{rating.strategy}</div>
                </div>
              )}
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