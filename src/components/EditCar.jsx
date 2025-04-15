import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../client'
import './EditCar.css'

function EditCar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState(null)
  const [car, setCar] = useState({
    name: '',
    team: '',
    engine: '',
    top_speed: ''
  })

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('f1cars')
        .select('*')
        .eq('id', id)
        .single()
        
      if (error) {
        setError('Car not found')
        return
      }
      
      setCar(data)
    } catch (err) {
      setError('Failed to load car')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCar(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!car.name || !car.team || !car.engine || !car.top_speed) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const { error: updateError } = await supabase
        .from('f1cars')
        .update({
          name: car.name,
          team: car.team,
          engine: car.engine,
          top_speed: parseFloat(car.top_speed)
        })
        .eq('id', id)
      
      if (updateError) {
        setError(`Update failed: ${updateError.message}`)
      } else {
        navigate(`/car/${id}`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return
    }
    
    try {
      setDeleteLoading(true)
      
      const { error: deleteError } = await supabase
        .from('f1cars')
        .delete()
        .eq('id', id)
      
      if (deleteError) {
        setError(`Delete failed: ${deleteError.message}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading && !car.name) {
    return <div className="edit-car-loading">Loading car details...</div>
  }

  return (
    <div className="edit-car-container">
      <h1 className="edit-car-title">Edit F1 Car</h1>
      
      {error && (
        <div className="edit-car-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleUpdate} className="edit-car-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Car Name</label>
          <input 
            id="name"
            name="name"
            type="text" 
            value={car.name} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="team" className="form-label">Team</label>
          <input 
            id="team"
            name="team"
            type="text" 
            value={car.team} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="engine" className="form-label">Engine Type</label>
          <input 
            id="engine"
            name="engine"
            type="text" 
            value={car.engine} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="top_speed" className="form-label">Top Speed (km/h)</label>
          <input 
            id="top_speed"
            name="top_speed"
            type="number" 
            value={car.top_speed} 
            onChange={handleChange} 
            className="form-input" 
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="update-button"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          
          <button 
            type="button" 
            onClick={handleDelete} 
            disabled={deleteLoading}
            className="delete-button"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        
        <div className="edit-car-navigation">
          <Link to={`/car/${id}`} className="cancel-link">
            Cancel and return to details
          </Link>
        </div>
      </form>
    </div>
  )
}

export default EditCar