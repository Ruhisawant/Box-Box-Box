import { Link } from 'react-router-dom'

const getRoleIconClass = (role) => {
  switch (role) {
    case 'Driver': return 'icon-driver'
    case 'Engineer': return 'icon-engineer'
    case 'Mechanic': return 'icon-mechanic'
    case 'Strategist': return 'icon-strategist'
    case 'Team Principal': return 'icon-principal'
    case 'Technical Director': return 'icon-technical'
    default: return 'icon-default'
  }
}

const SummaryCard = ({ member }) => {
  return (
    <div key={member.id} className='member-card'>
      <div className={`member-role-indicator ${getRoleIconClass(member.role)}`}>
        {member.role}
      </div>
      <div className='member-info'>
        <h3>{member.name}</h3>
        <div className='member-details'>
          <div className='detail'>
            <span className='detail-label'>Nationality:</span>
            <span className='detail-value'>{member.nationality}</span>
          </div>
          <div className='detail'>
            <span className='detail-label'>Age:</span>
            <span className='detail-value'>{member.age}</span>
          </div>
        </div>

        <div className='attribute-highlights'>
          {member.attributes && (
            <>
              {member.attributes.skill && (
                <div className='attribute'>
                  <span className='attribute-label'>Skill</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill'
                      style={{ width: `${(member.attributes.skill / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {member.attributes.experience && (
                <div className='attribute'>
                  <span className='attribute-label'>Experience</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill'
                      style={{ width: `${(member.attributes.experience / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {member.role === 'Driver' && member.attributes.aggression && (
                <div className='attribute'>
                  <span className='attribute-label'>Aggression</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill highlight'
                      style={{ width: `${(member.attributes.aggression / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {['Engineer', 'Mechanic', 'Technical Director'].includes(member.role) && member.attributes.technical && (
                <div className='attribute'>
                  <span className='attribute-label'>Technical</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill highlight'
                      style={{ width: `${(member.attributes.technical / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {member.role === 'Strategist' && member.attributes.strategy && (
                <div className='attribute'>
                  <span className='attribute-label'>Strategy</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill highlight'
                      style={{ width: `${(member.attributes.strategy / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {['Team Principal', 'Technical Director'].includes(member.role) && member.attributes.leadership && (
                <div className='attribute'>
                  <span className='attribute-label'>Leadership</span>
                  <div className='attribute-bar'>
                    <div
                      className='attribute-fill highlight'
                      style={{ width: `${(member.attributes.leadership / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className='member-bottom'>
          <span className='member-date'>
            {member.created_at && new Date(member.created_at).toLocaleDateString()}
          </span>
          <div className='member-actions'>
            <Link to={`/member-details/${member.id}`} className='view-button'>
              View
            </Link>
            <Link to={`/edit-member/${member.id}`} className='edit-button'>
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard