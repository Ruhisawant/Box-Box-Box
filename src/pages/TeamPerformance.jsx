import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, BadgePercent, Trophy, Flag, ChevronRight, 
  Award, Clock, ArrowUpRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from '../supabase';
import './TeamPerformance.css';

function TeamPerformance() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('team_members')
          .select('*');
          
        if (error) throw error;
        setTeamMembers(data || []);
      } catch (err) {
        console.error('Error fetching team members:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  // Calculate team performance metrics based on member attributes
  const calculateTeamPerformance = () => {
    if (teamMembers.length === 0) {
      return {
        speed: 0,
        reliability: 0,
        strategy: 0,
        innovation: 0,
        pitCrew: 0,
        overall: 0
      };
    }

    // Initialize performance metrics
    let speed = 0, reliability = 0, strategy = 0, innovation = 0, pitCrew = 0;
    let totalSpeed = 0, totalReliability = 0, totalStrategy = 0, totalInnovation = 0, totalPitCrew = 0;

    // Calculate metrics based on team member attributes
    teamMembers.forEach(member => {
      const attributes = member.attributes || {};
      
      // Different roles contribute differently to team metrics
      switch(member.role) {
        case 'Driver':
          speed += (attributes.skill || 0) * 0.8 + (attributes.aggression || 0) * 0.6;
          reliability += (attributes.focus || 0) * 0.7 + (attributes.experience || 0) * 0.6;
          strategy += (attributes.strategy || 0) * 0.4;
          totalSpeed += 1.4;
          totalReliability += 1.3;
          totalStrategy += 0.4;
          break;
        case 'Engineer':
          speed += (attributes.technical || 0) * 0.7;
          reliability += (attributes.skill || 0) * 0.8;
          innovation += (attributes.technical || 0) * 0.9;
          totalSpeed += 0.7;
          totalReliability += 0.8;
          totalInnovation += 0.9;
          break;
        case 'Mechanic':
          reliability += (attributes.skill || 0) * 0.8;
          pitCrew += (attributes.skill || 0) * 0.7 + (attributes.focus || 0) * 0.6;
          totalReliability += 0.8;
          totalPitCrew += 1.3;
          break;
        case 'Strategist':
          strategy += (attributes.strategy || 0) * 0.9 + (attributes.experience || 0) * 0.5;
          totalStrategy += 1.4;
          break;
        case 'Team Principal':
          strategy += (attributes.leadership || 0) * 0.6 + (attributes.strategy || 0) * 0.4;
          innovation += (attributes.leadership || 0) * 0.5;
          totalStrategy += 1.0;
          totalInnovation += 0.5;
          break;
        case 'Technical Director':
          innovation += (attributes.technical || 0) * 0.8 + (attributes.leadership || 0) * 0.4;
          reliability += (attributes.experience || 0) * 0.5;
          totalInnovation += 1.2;
          totalReliability += 0.5;
          break;
        case 'Pit Crew':
          pitCrew += (attributes.teamwork || 0) * 0.8 + (attributes.focus || 0) * 0.7;
          totalPitCrew += 1.5;
          break;
        default:
          // Generic contribution for other roles
          speed += (attributes.skill || 0) * 0.2;
          reliability += (attributes.skill || 0) * 0.2;
          strategy += (attributes.strategy || 0) * 0.2;
          innovation += (attributes.technical || 0) * 0.2;
          pitCrew += (attributes.teamwork || 0) * 0.2;
          totalSpeed += 0.2;
          totalReliability += 0.2;
          totalStrategy += 0.2;
          totalInnovation += 0.2;
          totalPitCrew += 0.2;
      }
    });

    // Calculate final metrics (ensuring we don't divide by zero)
    const finalSpeed = totalSpeed > 0 ? (speed / totalSpeed) : 0;
    const finalReliability = totalReliability > 0 ? (reliability / totalReliability) : 0;
    const finalStrategy = totalStrategy > 0 ? (strategy / totalStrategy) : 0;
    const finalInnovation = totalInnovation > 0 ? (innovation / totalInnovation) : 0;
    const finalPitCrew = totalPitCrew > 0 ? (pitCrew / totalPitCrew) : 0;

    // Calculate overall score
    const overall = (finalSpeed + finalReliability + finalStrategy + finalInnovation + finalPitCrew) / 5;

    return {
      speed: parseFloat(finalSpeed.toFixed(1)),
      reliability: parseFloat(finalReliability.toFixed(1)),
      strategy: parseFloat(finalStrategy.toFixed(1)),
      innovation: parseFloat(finalInnovation.toFixed(1)),
      pitCrew: parseFloat(finalPitCrew.toFixed(1)),
      overall: parseFloat(overall.toFixed(1))
    };
  };

  const teamPerformance = calculateTeamPerformance();

  // Function to get role display name
  const formatRole = (role) => {
    if (!role) return "Unknown";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Count roles for team composition
  const getRoleCount = () => {
    const roleCount = {};
    teamMembers.forEach(member => {
      const role = member.role || "Unknown";
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    return roleCount;
  };

  const roleCount = getRoleCount();

  // Prepare data for pie chart
  const pieData = Object.entries(roleCount).map(([role, count]) => ({
    name: formatRole(role),
    value: count
  }));

  // Colors for pie chart
  const COLORS = [
    "#e60000", // racing-red for drivers
    "#0055ff", // racing-blue for engineers
    "#ffcc00", // racing-yellow for mechanics
    "#00cc88", // green for strategists
    "#9933ff", // purple for team principals
    "#ff6600", // orange for technical directors
    "#0099cc", // light blue for pit crew
  ];

  // Calculate team balance metrics
  const calculateTeamBalance = () => {
    const roleWeights = {
      Driver: 0.25,
      Engineer: 0.2,
      Mechanic: 0.15,
      Strategist: 0.15,
      "Team Principal": 0.1,
      "Technical Director": 0.1,
      "Pit Crew": 0.05
    };

    // Check if we have key roles
    const hasDriver = teamMembers.some(m => m.role === "Driver");
    const hasEngineer = teamMembers.some(m => m.role === "Engineer");
    const hasTeamPrincipal = teamMembers.some(m => m.role === "Team Principal");

    // Calculate balance score based on role distribution
    let balanceScore = 0;
    let coverageScore = 0;
    
    const totalRoles = Object.keys(roleWeights).length;
    const presentRoles = new Set(teamMembers.map(m => m.role)).size;
    
    // Role coverage (what percentage of roles are filled)
    coverageScore = Math.round((presentRoles / totalRoles) * 100);
    
    // Balance calculation (how well distributed are the roles)
    if (teamMembers.length > 0) {
      // Ideal distribution
      const idealDistribution = Object.fromEntries(
        Object.entries(roleWeights).map(([role, weight]) => [role, weight])
      );
      
      // Actual distribution
      const actualDistribution = {};
      Object.keys(roleWeights).forEach(role => {
        actualDistribution[role] = 0;
      });
      
      teamMembers.forEach(member => {
        if (member.role in actualDistribution) {
          actualDistribution[member.role] = (actualDistribution[member.role] || 0) + 1;
        }
      });
      
      // Convert counts to percentages
      Object.keys(actualDistribution).forEach(role => {
        actualDistribution[role] = actualDistribution[role] / teamMembers.length;
      });
      
      // Calculate difference from ideal
      let totalDifference = 0;
      Object.keys(idealDistribution).forEach(role => {
        const ideal = idealDistribution[role] || 0;
        const actual = actualDistribution[role] || 0;
        totalDifference += Math.abs(ideal - actual);
      });
      
      // Convert to a score out of 100 (lower difference is better)
      balanceScore = Math.round((1 - (totalDifference / 2)) * 100);
      balanceScore = Math.max(0, Math.min(100, balanceScore));
    }

    // Team completeness (are key roles filled)
    const keyRolesScore = [
      hasDriver ? 40 : 0,
      hasEngineer ? 30 : 0,
      hasTeamPrincipal ? 30 : 0
    ].reduce((a, b) => a + b, 0);

    return {
      balance: balanceScore,
      coverage: coverageScore,
      keyRoles: keyRolesScore
    };
  };

  const teamBalance = calculateTeamBalance();

  // Calculate predicted race position
  const calculatePredictedPosition = () => {
    if (teamMembers.length === 0) return "N/A";
    
    // Formula 1 has 10 teams in a typical season
    const overall = teamPerformance.overall;
    
    if (overall >= 9) return "1st - 2nd";
    if (overall >= 8) return "2nd - 3rd";
    if (overall >= 7) return "3rd - 5th";
    if (overall >= 6) return "5th - 7th";
    if (overall >= 5) return "7th - 8th";
    if (overall >= 4) return "8th - 9th";
    return "10th";
  };

  if (loading) {
    return <div className="loading">Loading team data...</div>;
  }

  if (error) {
    return <div className="error">Error loading team data: {error}</div>;
  }

  return (
    <div className="main-content">
      <div className="performance-header">
        <div className="performance-header-content">
          <h1>Team Performance</h1>
          <p>Analyze your team's performance metrics and potential</p>
        </div>
      </div>

      <div className="metrics-section">
        <div className="container card">
          <div className="metric-header">
            <h3>Team Size</h3>
            <p>Total staff members</p>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              <Users className="icon" />
              <span className="value">{teamMembers.length}</span>
            </div>
            <Link to="/gallery" className="more-link">
              <ChevronRight className="icon" />
            </Link>
          </div>
        </div>

        <div className="container card">
          <div className="metric-header">
            <h3>Role Coverage</h3>
            <p>Filled role types</p>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              <BadgePercent className="icon" />
              <span className="value">{teamBalance.coverage}%</span>
            </div>
            <span className="metric-detail">
              {new Set(teamMembers.map(m => m.role)).size} of 7 roles
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${teamBalance.coverage}%` }}></div>
          </div>
        </div>

        <div className="container card">
          <div className="metric-header">
            <h3>Predicted Position</h3>
            <p>Expected race results</p>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              <Trophy className="icon" />
              <span className="value">{calculatePredictedPosition()}</span>
            </div>
            <div className="status-indicator">
              <Flag className={`icon ${teamPerformance.overall >= 7 ? "green" : teamPerformance.overall >= 5 ? "yellow" : "red"}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="performance-grid">
        <div className="container card performance-stats">
          <h2>Performance Ratings</h2>
          <div className="ratings-grid">
            <div className="rating-item">
              <div className="rating-label">Speed</div>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${teamPerformance.speed * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.speed}/10</div>
            </div>
            <div className="rating-item">
              <div className="rating-label">Reliability</div>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${teamPerformance.reliability * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.reliability}/10</div>
            </div>
            <div className="rating-item">
              <div className="rating-label">Strategy</div>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${teamPerformance.strategy * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.strategy}/10</div>
            </div>
            <div className="rating-item">
              <div className="rating-label">Innovation</div>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${teamPerformance.innovation * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.innovation}/10</div>
            </div>
            <div className="rating-item">
              <div className="rating-label">Pit Crew</div>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${teamPerformance.pitCrew * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.pitCrew}/10</div>
            </div>
            <div className="rating-item">
              <div className="rating-label">Overall</div>
              <div className="rating-bar overall">
                <div className="rating-fill" style={{ width: `${teamPerformance.overall * 10}%` }}></div>
              </div>
              <div className="rating-value">{teamPerformance.overall}/10</div>
            </div>
          </div>
        </div>

        <div className="container card composition-chart">
          <h2>Team Composition</h2>
          <p>Distribution of roles in your team</p>
          
          {teamMembers.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state">
              <Users className="icon large" />
              <h3>No Team Members Yet</h3>
              <p>Add team members to see your team composition analysis.</p>
              <Link to="/team/new" className="btn primary">Add Team Member</Link>
            </div>
          )}
        </div>
      </div>

      <div className="container card team-balance">
        <h2>Team Balance Analysis</h2>
        <p>How well-balanced and complete your team is</p>
        
        <div className="balance-metrics">
          <div className="balance-item">
            <div className="balance-header">
              <span>Role Distribution</span>
              <span className="value">{teamBalance.balance}%</span>
            </div>
            <div className="balance-bar">
              <div className="balance-fill red" style={{ width: `${teamBalance.balance}%` }}></div>
            </div>
            <p className="balance-description">
              How well your team's roles are balanced across different specialties
            </p>
          </div>

          <div className="balance-item">
            <div className="balance-header">
              <span>Key Roles Coverage</span>
              <span className="value">{teamBalance.keyRoles}%</span>
            </div>
            <div className="balance-bar">
              <div className="balance-fill blue" style={{ width: `${teamBalance.keyRoles}%` }}></div>
            </div>
            <p className="balance-description">
              Whether you have filled essential roles like Driver, Engineer, and Team Principal
            </p>
          </div>

          <div className="balance-item">
            <div className="balance-header">
              <span>Overall Team Completeness</span>
              <span className="value">
                {Math.round((teamBalance.balance + teamBalance.coverage + teamBalance.keyRoles) / 3)}%
              </span>
            </div>
            <div className="balance-bar">
              <div 
                className="balance-fill yellow" 
                style={{ width: `${Math.round((teamBalance.balance + teamBalance.coverage + teamBalance.keyRoles) / 3)}%` }}
              ></div>
            </div>
            <p className="balance-description">
              Overall assessment of your team's structure and readiness
            </p>
          </div>
        </div>

        <div className="insights-section">
          <h3>Performance Insights</h3>
          <ul className="insights-list">
            {teamMembers.length === 0 ? (
              <li className="empty-insight">Add team members to get performance insights</li>
            ) : (
              <>
                {!teamMembers.some(m => m.role === "Driver") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>Your team needs at least one driver to compete in races</span>
                  </li>
                )}
                {!teamMembers.some(m => m.role === "Engineer") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>Adding an engineer would improve your car development</span>
                  </li>
                )}
                {!teamMembers.some(m => m.role === "Team Principal") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>A team principal would help with overall management</span>
                  </li>
                )}
                {teamMembers.filter(m => m.role === "Driver").length > 2 && (
                  <li className="insight info">
                    <Clock className="icon" />
                    <span>You have {teamMembers.filter(m => m.role === "Driver").length} drivers. F1 teams typically have 2 main drivers.</span>
                  </li>
                )}
                {teamPerformance.pitCrew < 5 && teamMembers.some(m => m.role === "Driver") && (
                  <li className="insight info">
                    <ArrowUpRight className="icon" />
                    <span>Your pit crew rating is low. Consider improving this area to reduce pit stop times.</span>
                  </li>
                )}
                {teamPerformance.overall >= 8 && (
                  <li className="insight success">
                    <Trophy className="icon" />
                    <span>Your team has championship potential! Well-balanced across all departments.</span>
                  </li>
                )}
                {/* Top performer highlight */}
                {teamMembers.length > 0 && (
                  <li className="insight success">
                    <Award className="icon" />
                    <span>
                      {(() => {
                        const topPerformer = [...teamMembers].sort((a, b) => {
                          const aAttrs = a.attributes || {};
                          const bAttrs = b.attributes || {};
                          
                          const aAvg = Object.values(aAttrs).filter(v => typeof v === 'number').reduce((sum, v) => sum + v, 0) / 
                                      Object.values(aAttrs).filter(v => typeof v === 'number').length || 0;
                          const bAvg = Object.values(bAttrs).filter(v => typeof v === 'number').reduce((sum, v) => sum + v, 0) / 
                                      Object.values(bAttrs).filter(v => typeof v === 'number').length || 0;
                          
                          return bAvg - aAvg;
                        })[0];
                        
                        return `${topPerformer.name} is your standout team member with exceptional performance.`;
                      })()}
                    </span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TeamPerformance;