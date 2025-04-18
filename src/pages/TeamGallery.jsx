import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Funnel, UsersRound, ArrowDownUp } from 'lucide-react';
import { supabase } from '../supabase';
import './TeamGallery.css';

function TeamGallery() {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        'Error fetching team members: ' + error
      }
    };
    fetchTeamMembers();
  }, []);

  // Function to get role-specific icon class
  const getRoleIconClass = (role) => {
    switch(role) {
      case 'Driver': return 'icon-driver';
      case 'Engineer': return 'icon-engineer';
      case 'Mechanic': return 'icon-mechanic';
      case 'Strategist': return 'icon-strategist';
      case 'Team Principal': return 'icon-principal';
      case 'Technical Director': return 'icon-technical';
      default: return 'icon-default';
    }
  };

  const filteredMembers = members
    .filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedRole === 'All' || member.role === selectedRole)
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  return (
    <div className="main-content">
      <div className="gallery-header-content">
        <div className="gallery-header-text">
          <h2>Your Team</h2>
          <p>Manage your team members and their roles</p>
        </div>
        <Link to="/create" className="btn primary"><Plus className="icon" /> Add Team Member</Link>
      </div>

      <div className="container">
        <div className="filters-section">
          <div className="filter-group input-wrapper">
            <Search className="filter-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group input-wrapper">
            <Funnel className="filter-icon" size={18} />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Roles</option>
              <option value="Driver">Driver</option>
              <option value="Engineer">Engineer</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Strategist">Strategist</option>
              <option value="Team Principal">Team Principal</option>
              <option value="Technical Director">Technical Director</option>
            </select>
          </div>

          <div className="filter-group input-wrapper">
            <ArrowDownUp className="filter-icon" size={18} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="container">
          <UsersRound size={48} />
          <p>No team members yet</p>
          <Link to="/create" className="btn">
            <Plus className="icon" /> Add Your First Team Member
          </Link>
        </div>
      ) : (
        <div className="members-section">
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

export default TeamGallery;