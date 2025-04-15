import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../client'
import './CreateCar.css'

function CreateCar() {
  const [carData, setCarData] = useState({
    name: '',
    team: '',
    engine: '',
    topSpeed: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setCarData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { name, team, engine, topSpeed } = carData
    
    if (!name || !team || !engine || !topSpeed) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const { error: supabaseError } = await supabase.from('f1cars').insert([
        {
          name,
          team,
          engine,
          top_speed: parseFloat(topSpeed),
        },
      ])
    
      if (supabaseError) {
        setError(`Insert failed: ${supabaseError.message}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-car-container">
      <h1 className="create-car-title">Add a New F1 Car</h1>
      
      {error && (
        <div className="create-car-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="create-car-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Car Name</label>
          <input 
            id="name"
            type="text" 
            placeholder="Car Name" 
            value={carData.name} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team" className="form-label">Team</label>
          <input 
            id="team"
            type="text" 
            placeholder="Team" 
            value={carData.team} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="engine" className="form-label">Engine Type</label>
          <input 
            id="engine"
            type="text" 
            placeholder="Engine Type" 
            value={carData.engine} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="topSpeed" className="form-label">Top Speed (km/h)</label>
          <input 
            id="topSpeed"
            type="number" 
            placeholder="Top Speed" 
            value={carData.topSpeed} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="create-button"
          >
            {loading ? 'Adding...' : 'Add Car'}
          </button>
          <Link to="/" className="cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default CreateCar