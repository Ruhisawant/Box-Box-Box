import { Link } from "react-router-dom";
import { 
  Users, BadgePercent, Trophy, Flag, ChevronRight, 
  Award, Clock, ArrowUpRight
} from "lucide-react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import './TeamPerformance.css';

function TeamPerformance() {
  const teamMembers = [
    { id: 1, name: "Lewis Hamilton", role: "driver", experience: 15, rating: 9.5 },
    { id: 2, name: "George Russell", role: "driver", experience: 5, rating: 8.7 },
    { id: 3, name: "Adrian Newey", role: "technical_director", experience: 30, rating: 9.8 },
    { id: 4, name: "Toto Wolff", role: "team_principal", experience: 12, rating: 9.2 },
    { id: 5, name: "James Allison", role: "engineer", experience: 20, rating: 9.1 },
    { id: 6, name: "Michael Johnson", role: "mechanic", experience: 8, rating: 8.5 },
    { id: 7, name: "Sarah Williams", role: "strategist", experience: 10, rating: 8.9 },
    { id: 8, name: "David Rodriguez", role: "pit_crew", experience: 6, rating: 8.3 }
  ];

  const teamPerformance = {
    speed: 8.5,
    reliability: 7.8,
    strategy: 8.2,
    innovation: 9.0,
    pitCrew: 8.3,
    overall: 8.4
  };

  // Function to get role display name
  const formatRole = (role) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Count roles for team composition
  const roleCount = {};
  teamMembers.forEach(member => {
    roleCount[member.role] = (roleCount[member.role] || 0) + 1;
  });

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
      driver: 0.25,
      engineer: 0.2,
      mechanic: 0.15,
      strategist: 0.15,
      team_principal: 0.1,
      technical_director: 0.1,
      pit_crew: 0.05
    };

    // Check if we have key roles
    const hasDriver = teamMembers.some(m => m.role === "driver");
    const hasEngineer = teamMembers.some(m => m.role === "engineer");
    const hasTeamPrincipal = teamMembers.some(m => m.role === "team_principal");

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
        actualDistribution[member.role] = (actualDistribution[member.role] || 0) + 1;
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

  return (
    <div className="main-content">
      <div className="performance-header">
        <div className="header-content">
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
            <Link to="/team" className="more-link">
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
              {/* <ResponsiveContainer width="100%" height={350}>
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
              </ResponsiveContainer> */}
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
                {!teamMembers.some(m => m.role === "driver") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>Your team needs at least one driver to compete in races</span>
                  </li>
                )}
                {!teamMembers.some(m => m.role === "engineer") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>Adding an engineer would improve your car development</span>
                  </li>
                )}
                {!teamMembers.some(m => m.role === "team_principal") && (
                  <li className="insight warning">
                    <Award className="icon" />
                    <span>A team principal would help with overall management</span>
                  </li>
                )}
                {teamMembers.filter(m => m.role === "driver").length > 2 && (
                  <li className="insight info">
                    <Clock className="icon" />
                    <span>You have {teamMembers.filter(m => m.role === "driver").length} drivers. F1 teams typically have 2 main drivers.</span>
                  </li>
                )}
                {teamPerformance.pitCrew < 5 && teamMembers.some(m => m.role === "driver") && (
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
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TeamPerformance;