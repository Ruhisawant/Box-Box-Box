import { Link } from 'react-router-dom'
import './SummaryCard.css'

// Define all attributes with their colors - same as MemberDetails
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

// Calculate overall rating from attributes
const calculateRating = (attributes) => {
  if (!attributes) return 0;
  
  const attributeValues = Object.values(attributes).filter(val => 
    typeof val === 'number' && !isNaN(val)
  );
  
  if (attributeValues.length === 0) return 0;
  
  // Calculate average and round to nearest integer
  return Math.round(
    attributeValues.reduce((sum, value) => sum + value, 0) / attributeValues.length
  );
};

// Use the same getRoleStrengths function as MemberDetails
const getRoleStrengths = (member) => {
  if (!member || !member.attributes) return [];
  
  const strengths = [];
  const attributes = member.attributes || {};
  
  if (attributes.skill >= 8) strengths.push('High Skill Level');
  if (attributes.experience >= 8) strengths.push('Highly Experienced');
  if (attributes.teamwork >= 8) strengths.push('Excellent Team Player');
  if (attributes.focus >= 8) strengths.push('Strong Focus');
  if (attributes.fitness >= 8) strengths.push('Exceptional Fitness');
  if (attributes.aggression >= 8) strengths.push('Highly Aggressive');
  if (attributes.technical >= 8) strengths.push('Technical Expert');
  if (attributes.leadership >= 8) strengths.push('Strong Leader');
  if (attributes.strategy >= 8) strengths.push('Strategic Mastermind');
  
  return strengths.length > 0 ? strengths.slice(0, 3) : ['No key skills'];
};

// Get the top 2 highest attributes for a member
const getTopAttributes = (member) => {
  if (!member.attributes) return [];
  
  return Object.entries(member.attributes)
    .filter(([key, value]) => typeof value === 'number')
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .slice(0, 2);
};

// Get color for an attribute from the allAttributes array
const getAttributeColor = (key) => {
  const attribute = allAttributes.find(attr => attr.key === key);
  return attribute ? attribute.color : '#0580ff';
};

const getRoleIconClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'driver': return 'icon-driver';
    case 'engineer': return 'icon-engineer';
    case 'mechanic': return 'icon-mechanic';
    case 'strategist': return 'icon-strategist';
    case 'team principal': return 'icon-principal';
    case 'technical director': return 'icon-technical';
    default: return 'icon-default';
  }
};

const SummaryCard = ({ member }) => {
  const rating = calculateRating(member.attributes);
  const topStrengths = getRoleStrengths(member);
  const topAttributes = getTopAttributes(member);
  
  return (
    <div key={member.id} className='member-card' data-rating={rating}>
      <div className={`member-role-indicator ${getRoleIconClass(member.role)}`}>
        {member.role}
      </div>
      <div className='member-info'>
        <h3 data-rating={`${rating}/10`}>{member.name}</h3>
        <div className='member-details'>
          <div>
            <div className='detail'>
              <span className='detail-label'>Nationality:</span>
              <span className='detail-value'>{member.nationality}</span>
            </div>
            <div className='detail'>
              <span className='detail-label'>Age:</span>
              <span className='detail-value'>{member.age}</span>
            </div>
          </div>
        </div>

        <div className='attribute-highlights'>
          {/* Show top 2 attributes with consistent colors from allAttributes */}
          {topAttributes.map(([key, value]) => {
            const attributeColor = getAttributeColor(key);
            return (
              <div className='attribute' key={key}>
                <div className='attribute-label'>
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className='attribute-value'>{value}/10</span>
                </div>
                <div className='attribute-bar'>
                  <div
                    className='attribute-fill'
                    style={{ width: `${(value / 10) * 100}%`, backgroundColor: attributeColor }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Use consistent strength descriptions from MemberDetails */}
        {topStrengths.length > 0 && (
          <div className='member-strengths'>
            <div className='strengths-tags'>
              {topStrengths.slice(0, 2).map(strength => (
                <span key={strength} className='strength-tag'>{strength}</span>
              ))}
            </div>
          </div>
        )}

        <div className='member-bottom'>
          <span className='member-date'>
            {member.created_at && new Date(member.created_at).toLocaleDateString()}
          </span>
          <div className='member-actions'>
            <Link to={`/member-details/${member.id}`} className='card-btns'>
              Details
            </Link>
            <Link to={`/edit-member/${member.id}`} className='card-btns'>
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard