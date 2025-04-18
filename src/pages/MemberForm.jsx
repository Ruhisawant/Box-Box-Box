import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save, X, Timer, Calculator, ArrowLeft, User, Wrench, Users, BookUser, Cog, Plus } from 'lucide-react'
import { supabase } from '../supabase'
import './MemberForm.css'

function MemberForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [nationality, setNationality] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const { id } = useParams()
  const isEditMode = !!id
  const [attributes, setAttributes] = useState({
    skill: 1, experience: 1, fitness: 1, teamwork: 1, focus: 1,
    strategy: 1, technical: 1, leadership: 1, aggression: 1
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchMemberData = async () => {
        try {
          const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .eq('id', id)
            .single()
          
          if (error) throw error
          
          if (data) {
            setName(data.name || '')
            setRole(data.role || '')
            setNationality(data.nationality || '')
            setAge(data.age?.toString() || '')
            setBio(data.bio || '')
            
            setAttributes({
              skill: data.attributes?.skill || 1,
              experience: data.attributes?.experience || 1,
              fitness: data.attributes?.fitness || 1,
              teamwork: data.attributes?.teamwork || 1,
              focus: data.attributes?.focus || 1,
              strategy: data.attributes?.strategy || 1,
              technical: data.attributes?.technical || 1,
              leadership: data.attributes?.leadership || 1,
              aggression: data.attributes?.aggression || 1,
            })
          }
        } catch (error) {
          console.error('Error fetching member data:', error.message)
        }
      }
      
      fetchMemberData()
    }
  }, [id, isEditMode])

  const countries = [
    'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark', 'Finland', 'France', 'Germany', 
    'Hungary', 'India', 'Italy', 'Japan', 'Mexico', 'Monaco', 'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 
    'Russia', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'United Kingdom', 'United States', 'Venezuela'
  ]

  const roleOptions = [
    {label: 'Driver', description: 'Race the car and execute strategy on track', icon: <User className='role-icon' />},
    {label: 'Engineer', description: 'Design and optimize car performance', icon: <Cog className='role-icon' />},
    {label: 'Mechanic', description: 'Maintain and repair the race car', icon: <Wrench className='role-icon' />},
    {label: 'Strategist', description: 'Plan race strategy and tactics', icon: <Calculator className='role-icon' />},
    {label: 'Team Principal', description: 'Lead the entire team and make key decisions', icon: <Users className='role-icon' />},
    {label: 'Technical Director', description: 'Oversee all technical aspects of the car', icon: <BookUser className='role-icon' />},
    {label: 'Pit Crew', description: 'Execute fast pit stops during races', icon: <Timer className='role-icon' />}
  ]

  const attributeList = ['skill', 'experience', 'fitness', 'teamwork', 'focus', 'strategy', 'technical', 'leadership', 'aggression']
  
  const attributeDescriptions = {
    skill: 'Overall skill level in their specific role',
    experience: 'Years of experience and knowledge in F1',
    fitness: 'Physical condition and endurance',
    teamwork: 'Ability to work effectively with others',
    focus: 'Concentration and attention to detail',
    strategy: 'Race strategy planning and decision making',
    technical: 'Technical knowledge and problem-solving',
    leadership: 'Ability to lead and inspire the team',
    aggression: 'Racing aggression and overtaking ability',
  }
  
  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('team_members')
          .update({
            name,
            role,
            nationality,
            age: Number(age),
            bio,
            attributes,
            updated_at: new Date()
          })
          .eq('id', id)
          
        if (error) throw error
        navigate(`/member-details/${id}`)
      } else {
        const { data, error } = await supabase
          .from('team_members')
          .insert([{
            name,
            role,
            nationality,
            age: Number(age),
            bio,
            attributes,
            created_at: new Date()
          }])
        .select()
      
        if (error) throw error
        navigate(`/member-details/${data[0].id}`)
      }
    } catch (error) {
      `Error ${isEditMode ? 'updating' : 'creating'} team member:`, error.message
    }
  }

  const renderRoleOptions = () => {
    return (
      <div className='option-buttons'>
        {roleOptions.map(roleOption => (
          <button
            key={roleOption.label}
            type='button'
            className={role === roleOption.label ? 'option-btn selected' : 'option-btn'}
            onClick={() => setRole(roleOption.label)}
          >
            <span className='role-icon'>{roleOption.icon}</span>
            <span className='role-label'>{roleOption.label}</span>
            <span className='role-description'>{roleOption.description}</span>
          </button>
        ))}
      </div>
    )
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)
        
      if (error) throw error
      
      navigate('/gallery')
    } catch (error) {
      setError('Error deleting team member: ' + error.message)
    }
  }

  return (
    <div className='main-content'>
      <Link to='/gallery' className='btn secondary'><ArrowLeft className='icon'/> Back to Team</Link>
      <form onSubmit={handleSubmit}>

      <div className='header-content'>
        <div className='header-text'>
          <h2>{isEditMode ? 'Edit' : 'Add'} Team Member</h2>
          <p>{isEditMode ? 'Update existing team member details' : 'Create a new member for your F1 team'}</p>
        </div>
        <div className='header-actions'>
          <button
            type='button' className={`btn ${isEditMode ? 'secondary' : 'primary'}`}
            onClick={() => {
              if (isEditMode) {
                navigate(0)
              } else {
                setName('') 
                setRole('') 
                setNationality('') 
                setAge('') 
                setBio('') 
                setAttributes({
                  skill: 1, experience: 1, fitness: 1, teamwork: 1, focus: 1,
                  strategy: 1, technical: 1, leadership: 1, aggression: 1
                })
              }
            }}
          >
            <X className='icon' /> Reset
          </button>
          
          {isEditMode && (
            <button onClick={handleDelete} className='btn primary'>
              Delete Member
            </button>
          )}
        </div>
      </div>
                
      <div className='basic-info container'>
        <h2>Basic Information</h2>
        
        <div className='form-group'>
          <label htmlFor='name'>Full Name</label>
          <input
            type='text' id='name' value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. Lewis Hamilton'
            required
          />
        </div>
        
        <div className='form-group'>
          <label htmlFor='nationality'>Nationality</label>
          <select
            id='nationality' value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          >
            <option value='' disabled>Select nationality</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className='form-group'>
          <label htmlFor='age'>Age</label>
          <input
            type='number' id='age' min='16' max='80' value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder='e.g. 36'
            required
          />
        </div>
        
        <div className='form-group'>
          <label htmlFor='bio'>Biography</label>
          <textarea
            id='bio' rows={4} value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Enter a brief bio'
          />
        </div>
      </div>

      <div className='role-selection container'>
        <h2>Role</h2>
        {renderRoleOptions()}
      </div>

      <div className='attributes container'>
        <h2>Attributes</h2>
        <div className='attribute-sliders'>
          {attributeList.map(attribute => (
            <div key={attribute} className='attribute-slider'>
              <div className='attribute-label-row'>
                <label>{attributeDescriptions[attribute]}</label>
                <span className='attribute-value'>{attributes[attribute]}</span>
              </div>
              <input
                type='range'
                min='1'
                max='10'
                value={attributes[attribute]}
                onChange={(e) => handleAttributeChange(attribute, Number(e.target.value))}
              />

              <div className='attribute-description'>{attributeDescriptions[attribute]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="btn secondary" onClick={() => navigate('/gallery')}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          Create Team Member
        </button>
      </div>
      </form>
    </div>
  )
}

export default MemberForm