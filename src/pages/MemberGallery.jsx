import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './MemberGallery.css';

function TeamMemberGallery() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          
        if (error) throw error;
        
        setMembers(data || []);
      } catch (error) {
        setError('Error fetching team members: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // Function to get role-specific icon class
  const getRoleIconClass = (role) => {
    switch(role) {
      case 'Driver':
        return 'role-icon-driver';
      case 'Engineer':
        return 'role-icon-engineer';
      case 'Mechanic':
        return 'role-icon-mechanic';
      case 'Strategist':
        return 'role-icon-strategist';
      case 'Team Principal':
        return 'role-icon-principal';
      case 'Technical Director':
        return 'role-icon-technical';
      default:
        return 'role-icon-default';
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Your F1 Team Members</h2>
        <Link to="/create-member" className="create-link">+ Add Team Member</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading your team roster...</div>
      ) : members.length === 0 ? (
        <div className="empty-gallery">
          <p>Your team has no members yet! Add your first team member to get started.</p>
          <Link to="/create-member" className="btn btn-primary">Add Your First Team Member</Link>
        </div>
      ) : (
        <div className="members-grid">
          {members.map(member => (
            <Link to={`/team-member/${member.id}`} key={member.id} className="member-card">
              <div className={`member-role-indicator ${getRoleIconClass(member.role)}`}>
                {member.role}
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <div className="member-details">
                  <div className="detail">
                    <span className="detail-label">Nationality:</span>
                    <span className="detail-value">{member.nationality}</span>
                  </div>
                  <div className="detail">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{member.age}</span>
                  </div>
                </div>
                
                <div className="attribute-highlights">
                  {member.attributes && (
                    <>
                      {member.attributes.skill && (
                        <div className="attribute">
                          <span className="attribute-label">Skill</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill"
                              style={{ width: `${(member.attributes.skill / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {member.attributes.experience && (
                        <div className="attribute">
                          <span className="attribute-label">Experience</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill"
                              style={{ width: `${(member.attributes.experience / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Role-specific key attribute */}
                      {member.role === 'Driver' && member.attributes.aggression && (
                        <div className="attribute">
                          <span className="attribute-label">Aggression</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill highlight"
                              style={{ width: `${(member.attributes.aggression / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {['Engineer', 'Mechanic', 'Technical Director'].includes(member.role) && member.attributes.technical && (
                        <div className="attribute">
                          <span className="attribute-label">Technical</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill highlight"
                              style={{ width: `${(member.attributes.technical / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {member.role === 'Strategist' && member.attributes.strategy && (
                        <div className="attribute">
                          <span className="attribute-label">Strategy</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill highlight"
                              style={{ width: `${(member.attributes.strategy / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {['Team Principal', 'Technical Director'].includes(member.role) && member.attributes.leadership && (
                        <div className="attribute">
                          <span className="attribute-label">Leadership</span>
                          <div className="attribute-bar">
                            <div 
                              className="attribute-fill highlight"
                              style={{ width: `${(member.attributes.leadership / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="member-bottom">
                  <span className="member-date">
                    {member.created_at && new Date(member.created_at).toLocaleDateString()}
                  </span>
                  <div className="member-actions">
                    <Link to={`/update-member/${member.id}`} className="edit-button" onClick={(e) => e.stopPropagation()}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamMemberGallery;